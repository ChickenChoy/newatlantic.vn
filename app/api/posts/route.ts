import { NextRequest, NextResponse } from 'next/server';
import { getPosts, savePosts, addPost, deletePost } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Post } from '@/types';
import { logActivity } from '@/lib/activity-logs';

// Force Node.js runtime for fs operations
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const posts = getPosts();

    // Filter by single post ID
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

    const posts = getPosts();

    // Check if slug already exists
    if (posts.some(p => p.slug === slug)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const newPost: Post = {
      id: String(Date.now()),
      title,
      slug,
      excerpt: excerpt || '',
      content: content || '',
      image: image || '/images/posts/placeholder.jpg',
      date: date || new Date().toISOString().split('T')[0],
      author: author || 'Admin',
    };

    const success = addPost(newPost);

    if (success) {
      // Log activity
      await logActivity({
        action: 'create',
        entity: 'post',
        entityId: newPost.id,
        entityName: newPost.title,
      });

      // Revalidate pages
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

    const posts = getPosts();
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if new slug conflicts with another post
    if (updates.slug && posts.some(p => p.slug === updates.slug && p.id !== id)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const oldSlug = posts[index].slug;
    posts[index] = { ...posts[index], ...updates };

    const success = savePosts(posts);

    if (success) {
      // Log activity
      await logActivity({
        action: 'update',
        entity: 'post',
        entityId: id,
        entityName: posts[index].title,
      });

      // Revalidate pages
      revalidatePath('/tin-tuc');
      revalidatePath(`/tin-tuc/${oldSlug}`);
      if (updates.slug && updates.slug !== oldSlug) {
        revalidatePath(`/tin-tuc/${updates.slug}`);
      }
      revalidatePath('/');

      return NextResponse.json(posts[index]);
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

    const posts = getPosts();
    const post = posts.find(p => p.id === id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const success = deletePost(id);

    if (success) {
      // Log activity
      await logActivity({
        action: 'delete',
        entity: 'post',
        entityId: id,
        entityName: post.title,
      });

      // Revalidate pages
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
