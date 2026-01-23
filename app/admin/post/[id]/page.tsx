'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Post, PostCategory } from '@/types';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] border border-gray-300 rounded-lg bg-gray-50 animate-pulse" />,
});

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default function PostPage({ params }: PostPageProps) {
  const router = useRouter();
  const toast = useToast();
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Post>({
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '/images/place-holder/placeholder.jpg',
    date: new Date().toISOString().split('T')[0],
    category: 'Tin tức'
  });
  const [postCategories, setPostCategories] = useState<PostCategory[]>([]);

  const loadData = useCallback(async (postId: string) => {
    try {
      setLoading(true);

      // Initialize data first
      await fetch('/api/init', { method: 'POST' });

      // Fetch post categories
      const categoriesRes = await fetch('/api/post-categories');
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        // Filter only enabled categories and exclude "all"
        const enabledCategories = categoriesData
          .filter((cat: PostCategory) => cat.enabled && cat.slug !== 'all')
          .sort((a: PostCategory, b: PostCategory) => a.order - b.order);
        setPostCategories(enabledCategories);
      }

      if (postId === 'new') {
        // New post
        setFormData({
          id: Date.now().toString(),
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          image: '/images/place-holder/placeholder.jpg',
          date: new Date().toISOString().split('T')[0],
          category: 'Tin tức'
        });
      } else {
        // Fetch existing post
        const postRes = await fetch(`/api/posts?id=${postId}`);
        if (postRes.ok) {
          const post = await postRes.json();
          setFormData(post);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      loadData(p.id);
    });
  }, [params, loadData]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.warning('Vui lòng nhập tiêu đề bài viết');
      return;
    }

    setSaving(true);
    try {
      const postToSave = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
      };

      const isNew = id === 'new';
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch('/api/posts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postToSave),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save post');
      }

      toast.success(isNew ? 'Đã thêm bài viết mới thành công!' : 'Đã cập nhật bài viết thành công!');
      setTimeout(() => router.push('/admin'), 500);
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu bài viết');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-lightgray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-bodytext">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightgray">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/admin" className="text-primary hover:underline">
            ← Quay lại Admin
          </Link>
        </div>

        <div className="admin-card">
          <h1 className="card-title text-3xl mb-8">
            {id === 'new' ? 'Thêm bài viết mới' : 'Sửa bài viết'}
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-bodytext mb-2">Tiêu đề *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) });
                }}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-bodytext"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-bodytext mb-2">Slug (tự động)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-lightgray text-bodytext"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-bodytext mb-2">Tóm tắt *</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-bodytext"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-bodytext mb-2">Danh mục *</label>
              <select
                value={formData.category || 'Tin tức'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface text-bodytext"
              >
                {postCategories.length > 0 ? (
                  postCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Tin tức">Tin tức</option>
                    <option value="Sự kiện">Sự kiện</option>
                  </>
                )}
              </select>
              <p className="mt-1 text-xs text-gray-500">Chọn danh mục cho bài viết (có thể quản lý danh mục trong Admin → DM Tin tức)</p>
            </div>

            <div style={{ minHeight: '450px', position: 'relative', zIndex: 10 }}>
              <label className="block text-sm font-semibold text-bodytext mb-2">Nội dung *</label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                height={400}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-bodytext mb-2">Hình ảnh</label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-bodytext"
                />
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Hoặc nhập URL hình ảnh"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-bodytext"
                />
              </div>
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-3 w-48 h-32 object-cover rounded-lg border border-border" />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-bodytext mb-2">Ngày đăng</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-bodytext"
              />
            </div>

            <div className="flex gap-4 pt-6 border-t border-border">
              <Link
                href="/admin"
                className="px-8 py-3 border border-border text-bodytext rounded-lg hover:bg-lighthover transition-colors font-semibold"
              >
                Hủy
              </Link>
              <button
                onClick={handleSave}
                disabled={saving}
                className="admin-btn-primary px-8 py-3 disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : 'Lưu bài viết'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
