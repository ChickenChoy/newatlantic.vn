'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/types';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import dynamic from 'next/dynamic';
import MediaPicker from '@/components/admin/MediaPicker';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] border border-gray-300 rounded-lg bg-gray-50 animate-pulse" />,
});

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const toast = useToast();
  const [id, setId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    slug: '',
    category: '',
    categorySlug: '',
    categoryName: '',
    description: '',
    fullDescription: '',
    image: '/images/box-image/MAY.jpg',
    images: ['/images/box-image/MAY.jpg'],
    price: 'Liên hệ',
    specifications: {}
  });
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  const loadData = useCallback(async (productId: string) => {
    try {
      setLoading(true);

      // Initialize data first
      await fetch('/api/init', { method: 'POST' });

      // Fetch categories
      const categoriesRes = await fetch('/api/categories');
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);

        if (productId === 'new') {
          // New product - set default category
          const defaultCategory = categoriesData[0];
          setFormData({
            id: Date.now().toString(),
            name: '',
            slug: '',
            category: defaultCategory?.slug || '',
            categorySlug: defaultCategory?.slug || '',
            categoryName: defaultCategory?.name || '',
            description: '',
            fullDescription: '',
            image: '/images/box-image/MAY.jpg',
            images: ['/images/box-image/MAY.jpg'],
            price: 'Liên hệ',
            specifications: {}
          });
        } else {
          // Fetch existing product
          const productRes = await fetch(`/api/products?id=${productId}`);
          if (productRes.ok) {
            const product = await productRes.json();
            setFormData(product);
            setAdditionalImages(product.images || []);
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Use toast outside of callback to avoid dependency issues
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependencies - function should only be created once

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      loadData(p.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]); // loadData is stable (empty deps) so no need to include it

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.warning('Vui lòng nhập tên sản phẩm');
      return;
    }

    setSaving(true);
    try {
      const productToSave = {
        ...formData,
        images: additionalImages,
        slug: formData.slug || generateSlug(formData.name),
      };

      const isNew = id === 'new';
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToSave),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save product');
      }

      toast.success(isNew ? 'Đã thêm sản phẩm mới thành công!' : 'Đã cập nhật sản phẩm thành công!');
      setTimeout(() => router.push('/admin'), 500);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-lightgray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Đang tải dữ liệu...</p>
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
            {id === 'new' ? 'Thêm sản phẩm mới' : 'Sửa sản phẩm'}
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Tên sản phẩm *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) });
                }}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
              <label className="block text-sm font-semibold text-bodytext mb-2">Danh mục *</label>
              <select
                value={formData.categorySlug || formData.category}
                onChange={(e) => {
                  const cat = categories.find((c) => c.slug === e.target.value);
                  setFormData({
                    ...formData,
                    category: e.target.value,
                    categorySlug: e.target.value,
                    categoryName: cat?.name || ''
                  });
                }}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div style={{ minHeight: '350px', position: 'relative', zIndex: 20 }}>
              <label className="block text-sm font-semibold text-bodytext mb-2">Mô tả *</label>
              <RichTextEditor
                value={formData.description || ''}
                onChange={(description) => setFormData({ ...formData, description })}
                height={300}
              />
            </div>

            <div style={{ minHeight: '450px', position: 'relative', zIndex: 10 }}>
              <label className="block text-sm font-semibold text-bodytext mb-2">Thông số kỹ thuật & Mô tả chi tiết</label>
              <RichTextEditor
                value={formData.fullDescription || ''}
                onChange={(fullDescription) => setFormData({ ...formData, fullDescription })}
                height={400}
                placeholder="Nhập thông số kỹ thuật và mô tả chi tiết sản phẩm..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-bodytext mb-2">Giá</label>
              <input
                type="text"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <MediaPicker
                label="Hình ảnh chính"
                value={formData.image}
                onChange={(value) => setFormData({ ...formData, image: value })}
                folder="products"
                aspectRatio="square"
                placeholder="Chọn hình ảnh sản phẩm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-bodytext mb-2">Hình ảnh slider (nhiều ảnh)</label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach(file => {
                      if (file.size > 2 * 1024 * 1024) {
                        toast.warning(`Hình ảnh ${file.name} vượt quá 2MB, bỏ qua.`);
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setAdditionalImages(prev => [...prev, reader.result as string]);
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="text-sm text-bodytext">Chọn nhiều ảnh để thêm vào slider chi tiết sản phẩm</div>
              </div>
              {additionalImages.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {additionalImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-24 object-cover rounded-lg border border-border" />
                      <button
                        type="button"
                        onClick={() => setAdditionalImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5"
              />
              <label className="text-sm font-semibold text-bodytext">Sản phẩm nổi bật</label>
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
                {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
