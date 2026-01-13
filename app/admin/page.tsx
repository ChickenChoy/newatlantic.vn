'use client';

import { useState, useEffect } from 'react';
import { products as initialProducts, posts as initialPosts, categories } from '@/lib/data';
import { Product, Post } from '@/types';
import Link from 'next/link';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'posts'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  // Load data từ localStorage hoặc dùng data mặc định
  useEffect(() => {
    const loadData = () => {
      const savedProducts = localStorage.getItem('admin_products');
      const savedPosts = localStorage.getItem('admin_posts');
      
      setProducts(savedProducts ? JSON.parse(savedProducts) : initialProducts);
      setPosts(savedPosts ? JSON.parse(savedPosts) : initialPosts);
    };

    loadData();
    
    // Reload data when returning to this page
    window.addEventListener('focus', loadData);
    return () => window.removeEventListener('focus', loadData);
  }, []);

  // Export data.ts file
  const exportDataFile = () => {
    const fileContent = `import { Product, Category, Post, Service, Partner } from '@/types';

// Danh mục sản phẩm
export const categories: Category[] = ${JSON.stringify(categories, null, 2)};

// Sản phẩm
export const products: Product[] = ${JSON.stringify(products, null, 2)};

// Bài viết tin tức
export const posts: Post[] = ${JSON.stringify(posts, null, 2)};

// Dịch vụ
export const services: Service[] = [
  {
    id: '1',
    title: 'Thiết Bị Vật Tư PCCC',
    slug: 'thiet-bi-vat-tu-pccc',
    description: 'Cung cấp và thi công hệ thống PCCC chuyên nghiệp',
  },
  {
    id: '2',
    title: 'Thiết Bị Chuyên Ngành',
    slug: 'thiet-bi-chuyen-nganh',
    description: 'Thiết bị chuyên dụng cho các ngành công nghiệp',
  },
  {
    id: '3',
    title: 'Thiết Bị Ngành Điện',
    slug: 'thiet-bi-nganh-dien',
    description: 'Cung ứng và tư vấn hệ thống điện công nghiệp',
  },
];

// Đối tác
export const partners: Partner[] = [
  { id: '1', name: 'WILL-BURT', logo: '/logos/willburt.png' },
  { id: '2', name: 'HIAB', logo: '/logos/hiab.png' },
  { id: '3', name: 'LOVOL', logo: '/logos/lovol.png' },
  { id: '4', name: 'SKYMARK', logo: '/logos/SKYMARK.png' },
];
`;

    const blob = new Blob([fileContent], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Delete product
  const deleteProduct = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      const newProducts = products.filter(p => p.id !== id);
      setProducts(newProducts);
      localStorage.setItem('admin_products', JSON.stringify(newProducts));
    }
  };

  // Delete post
  const deletePost = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
      const newPosts = posts.filter(p => p.id !== id);
      setPosts(newPosts);
      localStorage.setItem('admin_posts', JSON.stringify(newPosts));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={exportDataFile}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            📥 Export data.ts
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'products'
                  ? 'text-[#5f7ab8] border-b-2 border-[#5f7ab8]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sản phẩm ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'posts'
                  ? 'text-[#5f7ab8] border-b-2 border-[#5f7ab8]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tin tức ({posts.length})
            </button>
          </div>
        </div>

        {/* Add new button */}
        <div className="mb-6">
          <Link
            href={activeTab === 'products' ? '/admin/product/new' : '/admin/post/new'}
            className="inline-block px-6 py-3 bg-[#5f7ab8] text-white rounded-lg hover:bg-[#4a6199] transition-colors font-semibold"
          >
            ➕ Thêm {activeTab === 'products' ? 'sản phẩm' : 'bài viết'} mới
          </Link>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tên</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Danh mục</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Giá</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{product.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          <span className="text-sm font-medium text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.price}</td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/admin/product/${product.id}`}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          ✏️ Sửa
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tiêu đề</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngày</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{post.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={post.image} alt={post.title} className="w-12 h-12 object-cover rounded" />
                          <span className="text-sm font-medium text-gray-900">{post.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{post.date}</td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/admin/post/${post.id}`}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          ✏️ Sửa
                        </Link>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
