'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { products as initialProducts, categories } from '../../../../lib/data';
import { Product } from '@/types';
import Link from 'next/link';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    slug: '',
    category: categories[0].slug,
    categorySlug: categories[0].slug,
    categoryName: categories[0].name,
    description: '',
    image: '/images/box-image/MAY.jpg',
    images: ['/images/box-image/MAY.jpg'],
    price: 'Liên hệ',
    specifications: {}
  });
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      
      if (p.id !== 'new') {
        // Load product data
        const savedProducts = localStorage.getItem('admin_products');
        const products = savedProducts ? JSON.parse(savedProducts) : initialProducts;
        const product = products.find((pr: Product) => pr.id === p.id);
        
        if (product) {
          setFormData(product);
          setAdditionalImages(product.images || []);
        }
      } else {
        // New product
        setFormData({
          id: Date.now().toString(),
          name: '',
          slug: '',
          category: categories[0].slug,
          categorySlug: categories[0].slug,
          categoryName: categories[0].name,
          description: '',
          image: '/images/box-image/MAY.jpg',
          images: ['/images/box-image/MAY.jpg'],
          price: 'Liên hệ',
          specifications: {}
        });
      }
    });
  }, [params]);

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

  const handleSave = () => {
    const savedProducts = localStorage.getItem('admin_products');
    let products = savedProducts ? JSON.parse(savedProducts) : initialProducts;
    
    const productToSave = {
      ...formData,
      images: additionalImages,
    };
    
    const existingIndex = products.findIndex((p: Product) => p.id === productToSave.id);
    
    if (existingIndex >= 0) {
      products[existingIndex] = productToSave;
    } else {
      products.push(productToSave);
    }
    
    localStorage.setItem('admin_products', JSON.stringify(products));
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
            {id === 'new' ? 'Thêm sản phẩm mới' : 'Sửa sản phẩm'}
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tên sản phẩm *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) });
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục *</label>
              <select
                value={formData.categorySlug || formData.category}
                onChange={(e) => {
                  const cat = categories.find((c: any) => c.slug === e.target.value);
                  setFormData({ 
                    ...formData, 
                    category: e.target.value,
                    categorySlug: e.target.value,
                    categoryName: cat?.name || ''
                  });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
              >
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Giá</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh chính</label>
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
                <img src={formData.image} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-lg border" />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh slider (nhiều ảnh)</label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach(file => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setAdditionalImages(prev => [...prev, reader.result as string]);
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                />
                <div className="text-sm text-gray-500">Chọn nhiều ảnh để thêm vào slider chi tiết sản phẩm</div>
              </div>
              {additionalImages.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {additionalImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-24 object-cover rounded-lg border" />
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
              <label className="text-sm font-semibold text-gray-700">Sản phẩm nổi bật</label>
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
                💾 Lưu sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

