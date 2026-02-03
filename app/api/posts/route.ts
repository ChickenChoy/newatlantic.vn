import { NextRequest, NextResponse } from 'next/server';
import { getPosts, addPost, updatePost, deletePost } from '@/lib/db-supabase';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    const { title, slug, excerpt, content, image, date, author } = body;

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
    const { id, ...updates } = body;

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

    // Map camelCase to snake_case
    const supabaseUpdates: any = { ...updates };
    if (updates.image) supabaseUpdates.featured_image = updates.image;
    if (updates.date) supabaseUpdates.published_at = updates.date;

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
