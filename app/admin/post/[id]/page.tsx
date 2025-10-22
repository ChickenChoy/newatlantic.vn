'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { posts as initialPosts } from '@/lib/data';
import { Post } from '@/types';
import Link from 'next/link';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default function PostPage({ params }: PostPageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [formData, setFormData] = useState<Post>({
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '/images/place-holder/placeholder.jpg',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      
      if (p.id !== 'new') {
        // Load post data
        const savedPosts = localStorage.getItem('admin_posts');
        const posts = savedPosts ? JSON.parse(savedPosts) : initialPosts;
        const post = posts.find((pt: Post) => pt.id === p.id);
        
        if (post) {
          setFormData(post);
        }
      } else {
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
      }
    });
  }, [params]);

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

  const handleSave = () => {
    const savedPosts = localStorage.getItem('admin_posts');
    let posts = savedPosts ? JSON.parse(savedPosts) : initialPosts;
    
    const existingIndex = posts.findIndex((p: Post) => p.id === formData.id);
    
    if (existingIndex >= 0) {
      posts[existingIndex] = formData;
    } else {
      posts.push(formData);
    }
    
    localStorage.setItem('admin_posts', JSON.stringify(posts));
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nội dung *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                required
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
                className="px-8 py-3 bg-[#5f7ab8] text-white rounded-lg hover:bg-[#4a6199] transition-colors font-semibold"
              >
                💾 Lưu bài viết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

