'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/types';
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
    date: new Date().toISOString().split('T')[0]
  });

  const loadData = useCallback(async (postId: string) => {
    try {
      setLoading(true);

      // Initialize data first
      await fetch('/api/init', { method: 'POST' });

      if (postId === 'new') {
        // New post
        setFormData({
          id: Date.now().toString(),
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          image: '/images/place-holder/placeholder.jpg',
          date: new Date().toISOString().split('T')[0]
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5f7ab8] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/admin" className="text-[#5f7ab8] hover:underline">
            ← Quay lại Admin
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {id === 'new' ? 'Thêm bài viết mới' : 'Sửa bài viết'}
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (tự động)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tóm tắt *</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                required
              />
            </div>

            <div style={{ minHeight: '450px', position: 'relative', zIndex: 10 }}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nội dung *</label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                height={400}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh</label>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                />
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Hoặc nhập URL hình ảnh"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent text-sm"
                />
              </div>
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-3 w-48 h-32 object-cover rounded-lg border" />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày đăng</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
              />
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Link
                href="/admin"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Hủy
              </Link>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-[#5f7ab8] text-white rounded-lg hover:bg-[#4a6199] transition-colors font-semibold disabled:opacity-50"
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
