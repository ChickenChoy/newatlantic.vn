import { NextRequest, NextResponse } from 'next/server';
import { getPosts, addPost, updatePost, deletePost } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type PostUpdatePayload = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  authorName?: string;
  author_name?: string;
  category?: string;
  categoryName?: string;
  category_name?: string;
  tags?: string[];
  status?: string;
  views?: number;
  likes?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  isFeatured?: boolean;
  orderIndex?: number;
  thumbnail?: string;
  image?: string;
  featuredImage?: string;
  featured_image?: string;
  date?: string;
  publishedAt?: string;
  published_at?: string;
};

function buildSupabasePostUpdates(updates: PostUpdatePayload): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.slug !== undefined) payload.slug = updates.slug;
  if (updates.excerpt !== undefined) payload.excerpt = updates.excerpt;
  if (updates.content !== undefined) payload.content = updates.content;
  if (updates.author !== undefined) payload.author = updates.author;
  if (updates.authorName !== undefined) payload.author_name = updates.authorName;
  if (updates.author_name !== undefined) payload.author_name = updates.author_name;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.categoryName !== undefined) {
    payload.category_name = updates.categoryName;
  } else if (updates.category_name !== undefined) {
    payload.category_name = updates.category_name;
  } else if (updates.category !== undefined) {
    payload.category_name = updates.category;
  }
  if (updates.tags !== undefined) payload.tags = updates.tags;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.views !== undefined) payload.views = updates.views;
  if (updates.likes !== undefined) payload.likes = updates.likes;
  if (updates.metaTitle !== undefined) payload.meta_title = updates.metaTitle;
  if (updates.metaDescription !== undefined) payload.meta_description = updates.metaDescription;
  if (updates.metaKeywords !== undefined) payload.meta_keywords = updates.metaKeywords;
  if (updates.isFeatured !== undefined) payload.is_featured = updates.isFeatured;
  if (updates.orderIndex !== undefined) payload.order_index = updates.orderIndex;
  if (updates.thumbnail !== undefined) payload.thumbnail = updates.thumbnail;

  if (updates.featuredImage !== undefined) payload.featured_image = updates.featuredImage;
  if (updates.featured_image !== undefined) payload.featured_image = updates.featured_image;
  if (updates.image !== undefined) payload.featured_image = updates.image;

  if (updates.publishedAt !== undefined) payload.published_at = updates.publishedAt;
  if (updates.published_at !== undefined) payload.published_at = updates.published_at;
  if (updates.date !== undefined) payload.published_at = updates.date;

  payload.updated_at = new Date().toISOString();
  return payload;
}

// GET - Lấy danh sách posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const posts = await getPosts();

    if (id) {
      const post = posts.find(p => p.id === id);
      if (post) {
        return NextResponse.json(post);
      }
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST - Thêm post mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, image, date, author, category, categoryName, category_name } = body as {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      image?: string;
      date?: string;
      author?: string;
      category?: string;
      categoryName?: string;
      category_name?: string;
    };

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const posts = await getPosts();

    if (posts.some(p => p.slug === slug)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const newPost: any = {
      id: String(Date.now()),
      title,
      slug,
      excerpt: excerpt || '',
      content: content || '',
      featured_image: image || '/images/posts/placeholder.jpg',
      published_at: date || new Date().toISOString(),
      author: author || 'Admin',
      category: category || 'Tin tức',
      category_name: categoryName || category_name || category || 'Tin tức',
      status: 'published'
    };

    const success = await addPost(newPost);

    if (success) {
      await logActivity({
        action: 'create',
        entity: 'post',
        entityId: newPost.id,
        entityName: newPost.title,
      });

      revalidatePath('/tin-tuc');
      revalidatePath('/');

      return NextResponse.json(newPost, { status: 201 });
    }

    return NextResponse.json({ error: 'Failed to add post' }, { status: 500 });
  } catch (error) {
    console.error('Error adding post:', error);
    return NextResponse.json({ error: 'Failed to add post' }, { status: 500 });
  }
}

// PUT - Cập nhật post
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body as { id?: string } & PostUpdatePayload;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const posts = await getPosts();
    const post = posts.find(p => p.id === id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (updates.slug && posts.some(p => p.slug === updates.slug && p.id !== id)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Only allow known/safe columns to avoid updating non-existent fields like `image`, `date`, etc.
    const supabaseUpdates = buildSupabasePostUpdates(updates);

    if (Object.keys(supabaseUpdates).length === 1 && supabaseUpdates.updated_at) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const success = await updatePost(id, supabaseUpdates);

    if (success) {
      await logActivity({
        action: 'update',
        entity: 'post',
        entityId: id,
        entityName: updates.title || post.title,
      });

      revalidatePath('/tin-tuc');
      revalidatePath(`/tin-tuc/${post.slug}`);
      revalidatePath('/');

      return NextResponse.json({ ...post, ...updates });
    }

    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE - Xóa post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const posts = await getPosts();
    const post = posts.find(p => p.id === id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const success = await deletePost(id);

    if (success) {
      await logActivity({
        action: 'delete',
        entity: 'post',
        entityId: id,
        entityName: post.title,
      });

      revalidatePath('/tin-tuc');
      revalidatePath(`/tin-tuc/${post.slug}`);
      revalidatePath('/');

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
