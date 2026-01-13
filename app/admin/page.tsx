'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { products as initialProducts, posts as initialPosts, categories } from '@/lib/data';
import { Product, Post } from '@/types';
import Link from 'next/link';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'posts'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'normal'>('all');

  // Selection states
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());

  // Bulk edit modal states
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [bulkEditCategory, setBulkEditCategory] = useState('');
  const [bulkEditFeatured, setBulkEditFeatured] = useState<'no-change' | 'true' | 'false'>('no-change');
  const [bulkEditPrice, setBulkEditPrice] = useState('');

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

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const matchSearch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchCategory = categoryFilter === 'all' || product.category === categoryFilter;

      // Featured filter
      const matchFeatured = featuredFilter === 'all' ||
        (featuredFilter === 'featured' && product.featured) ||
        (featuredFilter === 'normal' && !product.featured);

      return matchSearch && matchCategory && matchFeatured;
    });
  }, [products, searchQuery, categoryFilter, featuredFilter]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchSearch = searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchSearch;
    });
  }, [posts, searchQuery]);

  // Select all products
  const selectAllProducts = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  // Select all posts
  const selectAllPosts = () => {
    if (selectedPosts.size === filteredPosts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(filteredPosts.map(p => p.id)));
    }
  };

  // Toggle product selection
  const toggleProductSelection = (id: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  // Toggle post selection
  const togglePostSelection = (id: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPosts(newSelected);
  };

  // Bulk delete products
  const bulkDeleteProducts = () => {
    if (selectedProducts.size === 0) return;
    if (confirm(`Bạn có chắc muốn xóa ${selectedProducts.size} sản phẩm đã chọn?`)) {
      const newProducts = products.filter(p => !selectedProducts.has(p.id));
      setProducts(newProducts);
      localStorage.setItem('admin_products', JSON.stringify(newProducts));
      setSelectedProducts(new Set());
    }
  };

  // Bulk delete posts
  const bulkDeletePosts = () => {
    if (selectedPosts.size === 0) return;
    if (confirm(`Bạn có chắc muốn xóa ${selectedPosts.size} bài viết đã chọn?`)) {
      const newPosts = posts.filter(p => !selectedPosts.has(p.id));
      setPosts(newPosts);
      localStorage.setItem('admin_posts', JSON.stringify(newPosts));
      setSelectedPosts(new Set());
    }
  };

  // Open bulk edit modal
  const openBulkEditModal = () => {
    if (selectedProducts.size === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để chỉnh sửa');
      return;
    }
    setBulkEditCategory('');
    setBulkEditFeatured('no-change');
    setBulkEditPrice('');
    setShowBulkEditModal(true);
  };

  // Bulk edit products
  const applyBulkEdit = () => {
    if (selectedProducts.size === 0) return;

    const newProducts = products.map(product => {
      if (!selectedProducts.has(product.id)) return product;

      const updated = { ...product };

      if (bulkEditCategory && bulkEditCategory !== '') {
        updated.category = bulkEditCategory;
        const cat = categories.find(c => c.slug === bulkEditCategory);
        if (cat) updated.categoryName = cat.name;
      }

      if (bulkEditFeatured !== 'no-change') {
        updated.featured = bulkEditFeatured === 'true';
      }

      if (bulkEditPrice && bulkEditPrice !== '') {
        updated.price = bulkEditPrice;
      }

      return updated;
    });

    setProducts(newProducts);
    localStorage.setItem('admin_products', JSON.stringify(newProducts));
    setShowBulkEditModal(false);
    setSelectedProducts(new Set());
    alert(`Đã cập nhật ${selectedProducts.size} sản phẩm thành công!`);
  };

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
  { id: '3', name: 'SKYMARK', logo: '/logos/SKYMARK.png' },
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

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setFeaturedFilter('all');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-14">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={exportDataFile}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Xuất file data.ts
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={() => { setActiveTab('products'); setSearchQuery(''); setSelectedProducts(new Set()); }}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'products'
                    ? 'text-[#5f7ab8] border-b-2 border-[#5f7ab8]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sản phẩm ({products.length})
              </button>
              <button
                onClick={() => { setActiveTab('posts'); setSearchQuery(''); setSelectedPosts(new Set()); }}
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

          {/* Search & Filter Bar */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={activeTab === 'products' ? 'Tìm kiếm sản phẩm...' : 'Tìm kiếm bài viết...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Category Filter (Products only) */}
              {activeTab === 'products' && (
                <>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                  >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>

                  <select
                    value={featuredFilter}
                    onChange={(e) => setFeaturedFilter(e.target.value as 'all' | 'featured' | 'normal')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="featured">Nổi bật</option>
                    <option value="normal">Thường</option>
                  </select>
                </>
              )}

              {/* Clear filters */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Xóa bộ lọc
              </button>
            </div>

            {/* Results count */}
            <div className="mt-3 text-sm text-gray-600">
              {activeTab === 'products'
                ? `Hiển thị ${filteredProducts.length} / ${products.length} sản phẩm`
                : `Hiển thị ${filteredPosts.length} / ${posts.length} bài viết`
              }
            </div>
          </div>

          {/* Action Bar */}
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <Link
              href={activeTab === 'products' ? '/admin/product/new' : '/admin/post/new'}
              className="inline-block px-6 py-3 bg-[#5f7ab8] text-white rounded-lg hover:bg-[#4a6199] transition-colors font-semibold"
            >
              + Thêm {activeTab === 'products' ? 'sản phẩm' : 'bài viết'} mới
            </Link>

            {/* Bulk Actions */}
            {activeTab === 'products' && selectedProducts.size > 0 && (
              <>
                <span className="text-gray-600 font-medium">
                  Đã chọn {selectedProducts.size} sản phẩm
                </span>
                <button
                  onClick={openBulkEditModal}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                >
                  Chỉnh sửa hàng loạt
                </button>
                <button
                  onClick={bulkDeleteProducts}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Xóa đã chọn
                </button>
              </>
            )}

            {activeTab === 'posts' && selectedPosts.size > 0 && (
              <>
                <span className="text-gray-600 font-medium">
                  Đã chọn {selectedPosts.size} bài viết
                </span>
                <button
                  onClick={bulkDeletePosts}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Xóa đã chọn
                </button>
              </>
            )}
          </div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={filteredProducts.length > 0 && selectedProducts.size === filteredProducts.length}
                          onChange={selectAllProducts}
                          className="w-4 h-4 rounded border-gray-300 text-[#5f7ab8] focus:ring-[#5f7ab8]"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tên</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Danh mục</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Giá</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Nổi bật</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className={`hover:bg-gray-50 ${selectedProducts.has(product.id) ? 'bg-blue-50' : ''}`}>
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="w-4 h-4 rounded border-gray-300 text-[#5f7ab8] focus:ring-[#5f7ab8]"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{product.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                            <span className="text-sm font-medium text-gray-900 max-w-[200px] truncate">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.categoryName || product.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{product.price}</td>
                        <td className="px-6 py-4 text-center">
                          {product.featured ? (
                            <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">Có</span>
                          ) : (
                            <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded">Không</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={`/admin/product/${product.id}`}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Sửa
                          </Link>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    Không tìm thấy sản phẩm nào
                  </div>
                )}
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
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={filteredPosts.length > 0 && selectedPosts.size === filteredPosts.length}
                          onChange={selectAllPosts}
                          className="w-4 h-4 rounded border-gray-300 text-[#5f7ab8] focus:ring-[#5f7ab8]"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tiêu đề</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngày</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className={`hover:bg-gray-50 ${selectedPosts.has(post.id) ? 'bg-blue-50' : ''}`}>
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedPosts.has(post.id)}
                            onChange={() => togglePostSelection(post.id)}
                            className="w-4 h-4 rounded border-gray-300 text-[#5f7ab8] focus:ring-[#5f7ab8]"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{post.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={post.image} alt={post.title} className="w-12 h-12 object-cover rounded" />
                            <span className="text-sm font-medium text-gray-900 max-w-[300px] truncate">{post.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{post.date}</td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={`/admin/post/${post.id}`}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Sửa
                          </Link>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPosts.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    Không tìm thấy bài viết nào
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Edit Modal - Using Portal to render outside container */}
      {showBulkEditModal && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          {/* Overlay */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)'
            }}
            onClick={() => setShowBulkEditModal(false)}
          />

          {/* Modal Content */}
          <div
            style={{
              position: 'relative',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              width: '100%',
              maxWidth: '400px',
              padding: '24px',
              zIndex: 100000
            }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Chỉnh sửa hàng loạt ({selectedProducts.size} sản phẩm)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select
                  value={bulkEditCategory}
                  onChange={(e) => setBulkEditCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                >
                  <option value="">-- Không thay đổi --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nổi bật</label>
                <select
                  value={bulkEditFeatured}
                  onChange={(e) => setBulkEditFeatured(e.target.value as 'no-change' | 'true' | 'false')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                >
                  <option value="no-change">-- Không thay đổi --</option>
                  <option value="true">Có</option>
                  <option value="false">Không</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
                <input
                  type="text"
                  value={bulkEditPrice}
                  onChange={(e) => setBulkEditPrice(e.target.value)}
                  placeholder="Để trống nếu không thay đổi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowBulkEditModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={applyBulkEdit}
                className="px-4 py-2 bg-[#5f7ab8] text-white rounded-lg hover:bg-[#4a6199] font-medium"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
