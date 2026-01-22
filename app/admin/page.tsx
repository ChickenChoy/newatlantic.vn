'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Product, Post, Category, SiteSettings, OfficeLocation, FooterLink, GalleryImage, Catalog, HeroSlide, HomepageStat, PartnerLogo } from '@/types';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import PasswordInput from '@/components/PasswordInput';
import ImageUpload from '@/components/ImageUpload';

export default function AdminPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'products' | 'posts' | 'categories' | 'settings' | 'site-settings' | 'gallery' | 'catalogs' | 'partners'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // CMS Data states
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([]);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [homepageStats, setHomepageStats] = useState<HomepageStat[]>([]);
  const [partnerLogos, setPartnerLogos] = useState<PartnerLogo[]>([]);

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

  // Category edit modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '', image: '' });

  // TOTP/Settings states
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [totpSetupData, setTotpSetupData] = useState<{ secret: string; qrCode: string } | null>(null);
  const [totpVerifyCode, setTotpVerifyCode] = useState('');
  const [totpDisableCode, setTotpDisableCode] = useState('');
  const [totpPassword, setTotpPassword] = useState('');
  const [showTotpPassword, setShowTotpPassword] = useState(false);
  const [totpLoading, setTotpLoading] = useState(false);
  const [totpError, setTotpError] = useState('');
  const [showDisableModal, setShowDisableModal] = useState(false);

  // Load data từ API
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Gọi init API để đảm bảo data đã được khởi tạo từ lib/data.ts
      await fetch('/api/init', { method: 'POST' });

      const [productsRes, postsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/posts'),
        fetch('/api/categories'),
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }

      // Load TOTP status
      const totpRes = await fetch('/api/totp');
      if (totpRes.ok) {
        const totpData = await totpRes.json();
        setTotpEnabled(totpData.totpEnabled);
      }

      // Load CMS data
      const [siteSettingsRes, officeLocationsRes, footerLinksRes, galleryRes, catalogsRes, heroSlidesRes, homepageStatsRes, partnerLogosRes] = await Promise.all([
        fetch('/api/site-settings'),
        fetch('/api/office-locations'),
        fetch('/api/footer-links'),
        fetch('/api/gallery'),
        fetch('/api/catalogs'),
        fetch('/api/hero-slides'),
        fetch('/api/homepage-stats'),
        fetch('/api/partner-logos'),
      ]);

      if (siteSettingsRes.ok) setSiteSettings(await siteSettingsRes.json());
      if (officeLocationsRes.ok) setOfficeLocations(await officeLocationsRes.json());
      if (footerLinksRes.ok) setFooterLinks(await footerLinksRes.json());
      if (galleryRes.ok) setGalleryImages(await galleryRes.json());
      if (catalogsRes.ok) setCatalogs(await catalogsRes.json());
      if (heroSlidesRes.ok) setHeroSlides(await heroSlidesRes.json());
      if (homepageStatsRes.ok) setHomepageStats(await homepageStatsRes.json());
      if (partnerLogosRes.ok) setPartnerLogos(await partnerLogosRes.json());
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Không thể tải dữ liệu. Vui lòng refresh trang.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
  const bulkDeleteProducts = async () => {
    if (selectedProducts.size === 0) return;
    const confirmed = await toast.confirm({
      title: 'Xác nhận xóa',
      message: `Bạn có chắc muốn xóa ${selectedProducts.size} sản phẩm đã chọn?`,
      confirmText: 'Xóa',
      type: 'danger'
    });
    if (!confirmed) return;

    setSaving(true);
    try {
      const deletePromises = Array.from(selectedProducts).map(id =>
        fetch(`/api/products?id=${id}`, { method: 'DELETE' })
      );

      await Promise.all(deletePromises);
      await loadData();
      setSelectedProducts(new Set());
      toast.success('Đã xóa thành công!');
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Có lỗi xảy ra khi xóa sản phẩm');
    } finally {
      setSaving(false);
    }
  };

  // Bulk delete posts
  const bulkDeletePosts = async () => {
    if (selectedPosts.size === 0) return;
    const confirmed = await toast.confirm({
      title: 'Xác nhận xóa',
      message: `Bạn có chắc muốn xóa ${selectedPosts.size} bài viết đã chọn?`,
      confirmText: 'Xóa',
      type: 'danger'
    });
    if (!confirmed) return;

    setSaving(true);
    try {
      const deletePromises = Array.from(selectedPosts).map(id =>
        fetch(`/api/posts?id=${id}`, { method: 'DELETE' })
      );

      await Promise.all(deletePromises);
      await loadData();
      setSelectedPosts(new Set());
      toast.success('Đã xóa thành công!');
    } catch (error) {
      console.error('Error deleting posts:', error);
      toast.error('Có lỗi xảy ra khi xóa bài viết');
    } finally {
      setSaving(false);
    }
  };

  // Open bulk edit modal
  const openBulkEditModal = () => {
    if (selectedProducts.size === 0) {
      toast.warning('Vui lòng chọn ít nhất một sản phẩm để chỉnh sửa');
      return;
    }
    setBulkEditCategory('');
    setBulkEditFeatured('no-change');
    setBulkEditPrice('');
    setShowBulkEditModal(true);
  };

  // Bulk edit products
  const applyBulkEdit = async () => {
    if (selectedProducts.size === 0) return;

    setSaving(true);
    try {
      const updatePromises = Array.from(selectedProducts).map(async (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const updates: Partial<Product> & { id: string } = { id: productId };

        if (bulkEditCategory && bulkEditCategory !== '') {
          updates.category = bulkEditCategory;
          const cat = categories.find(c => c.slug === bulkEditCategory);
          if (cat) updates.categoryName = cat.name;
        }

        if (bulkEditFeatured !== 'no-change') {
          updates.featured = bulkEditFeatured === 'true';
        }

        if (bulkEditPrice && bulkEditPrice !== '') {
          updates.price = bulkEditPrice;
        }

        return fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
      });

      await Promise.all(updatePromises);
      await loadData();
      setShowBulkEditModal(false);
      setSelectedProducts(new Set());
      toast.success(`Đã cập nhật ${selectedProducts.size} sản phẩm thành công!`);
    } catch (error) {
      console.error('Error updating products:', error);
      toast.error('Có lỗi xảy ra khi cập nhật sản phẩm');
    } finally {
      setSaving(false);
    }
  };

  // Category CRUD functions
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', slug: '', description: '', image: '' });
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || ''
    });
    setShowCategoryModal(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const saveCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast.warning('Vui lòng nhập tên danh mục');
      return;
    }

    const slug = categoryForm.slug.trim() || generateSlug(categoryForm.name);

    setSaving(true);
    try {
      if (editingCategory) {
        // Update existing category
        const response = await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCategory.id,
            name: categoryForm.name,
            slug,
            description: categoryForm.description,
            image: categoryForm.image
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update category');
        }

        // Update products with this category if slug changed
        if (editingCategory.slug !== slug) {
          const productsToUpdate = products.filter(p => p.category === editingCategory.slug);
          await Promise.all(productsToUpdate.map(p =>
            fetch('/api/products', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: p.id,
                category: slug,
                categoryName: categoryForm.name
              }),
            })
          ));
        }

        await loadData();
        toast.success('Đã cập nhật danh mục thành công!');
      } else {
        // Add new category
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: categoryForm.name,
            slug,
            description: categoryForm.description,
            image: categoryForm.image
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to add category');
        }

        await loadData();
        toast.success('Đã thêm danh mục mới thành công! Trang danh mục mới đã được tạo tự động.');
      }

      setShowCategoryModal(false);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu danh mục');
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    const category = categories.find(c => c.id === id);
    if (!category) return;

    const productsInCategory = products.filter(p => p.category === category.slug);
    if (productsInCategory.length > 0) {
      toast.warning(`Không thể xóa danh mục này vì có ${productsInCategory.length} sản phẩm đang sử dụng.`);
      return;
    }

    const confirmed = await toast.confirm({
      title: 'Xác nhận xóa',
      message: `Bạn có chắc muốn xóa danh mục "${category.name}"?`,
      confirmText: 'Xóa',
      type: 'danger'
    });
    if (!confirmed) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }

      await loadData();
      toast.success('Đã xóa danh mục thành công!');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa danh mục');
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    const confirmed = await toast.confirm({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc muốn xóa sản phẩm này?',
      confirmText: 'Xóa',
      type: 'danger'
    });
    if (!confirmed) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product');
      }

      await loadData();
      toast.success('Đã xóa sản phẩm thành công!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa sản phẩm');
    } finally {
      setSaving(false);
    }
  };

  // Delete post
  const deletePost = async (id: string) => {
    const confirmed = await toast.confirm({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc muốn xóa bài viết này?',
      confirmText: 'Xóa',
      type: 'danger'
    });
    if (!confirmed) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete post');
      }

      await loadData();
      toast.success('Đã xóa bài viết thành công!');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa bài viết');
    } finally {
      setSaving(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setFeaturedFilter('all');
  };

  // TOTP Setup
  const handleTotpSetup = async () => {
    setTotpLoading(true);
    setTotpError('');
    try {
      const response = await fetch('/api/totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup', password: totpPassword }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTotpSetupData({ secret: data.secret, qrCode: data.qrCode });
        setTotpPassword('');
      } else {
        setTotpError(data.error || 'Có lỗi xảy ra');
      }
    } catch {
      setTotpError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setTotpLoading(false);
    }
  };

  // TOTP Verify Setup
  const handleTotpVerifySetup = async () => {
    setTotpLoading(true);
    setTotpError('');
    try {
      const response = await fetch('/api/totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-setup', token: totpVerifyCode }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTotpEnabled(true);
        setTotpSetupData(null);
        setTotpVerifyCode('');
        toast.success('Đã kích hoạt Google Authenticator thành công!');
      } else {
        setTotpError(data.error || 'Mã xác thực không đúng');
      }
    } catch {
      setTotpError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setTotpLoading(false);
    }
  };

  // TOTP Disable
  const handleTotpDisable = async () => {
    setTotpLoading(true);
    setTotpError('');
    try {
      const response = await fetch('/api/totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disable', password: totpPassword, token: totpDisableCode }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTotpEnabled(false);
        setShowDisableModal(false);
        setTotpPassword('');
        setTotpDisableCode('');
        localStorage.removeItem('admin_totp_verified');
        toast.success('Đã tắt Google Authenticator!');
      } else {
        setTotpError(data.error || 'Có lỗi xảy ra');
      }
    } catch {
      setTotpError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setTotpLoading(false);
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
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              {saving && (
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#5f7ab8]"></div>
                  Đang lưu...
                </span>
              )}
              <button
                onClick={loadData}
                disabled={saving}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Info banner */}
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              <strong>Hệ thống CMS đã được cập nhật!</strong> Mọi thay đổi (thêm, sửa, xóa danh mục/sản phẩm/bài viết)
              sẽ được lưu trực tiếp vào database và tự động cập nhật trên website.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex flex-wrap gap-2 md:gap-4">
              <button
                onClick={() => { setActiveTab('products'); setSearchQuery(''); setSelectedProducts(new Set()); }}
                className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-colors text-sm md:text-base ${
                  activeTab === 'products'
                    ? 'text-[#5f7ab8] border-b-2 border-[#5f7ab8]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sản phẩm ({products.length})
              </button>
              <button
                onClick={() => { setActiveTab('posts'); setSearchQuery(''); setSelectedPosts(new Set()); }}
                className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-colors text-sm md:text-base ${
                  activeTab === 'posts'
                    ? 'text-[#5f7ab8] border-b-2 border-[#5f7ab8]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Tin tức ({posts.length})
              </button>
              <button
                onClick={() => { setActiveTab('categories'); setSearchQuery(''); }}
                className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-colors text-sm md:text-base ${
                  activeTab === 'categories'
                    ? 'text-[#5f7ab8] border-b-2 border-[#5f7ab8]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Danh mục ({categories.length})
              </button>
              <button
                onClick={() => { setActiveTab('site-settings'); setSearchQuery(''); }}
                className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-colors text-sm md:text-base ${
                  activeTab === 'site-settings'
                    ? 'text-[#5f7ab8] border-b-2 border-[#5f7ab8]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Website
              </button>
              <button
                onClick={() => { setActiveTab('gallery'); setSearchQuery(''); }}
                className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-colors text-sm md:text-base ${
                  activeTab === 'gallery'
                    ? 'text-[#5f7ab8] border-b-2 border-[#5f7ab8]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Thư viện ({galleryImages.length})
              </button>
              <button
                onClick={() => { setActiveTab('catalogs'); setSearchQuery(''); }}
                className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-colors text-sm md:text-base ${
                  activeTab === 'catalogs'
                    ? 'text-[#5f7ab8] border-b-2 border-[#5f7ab8]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Catalogs ({catalogs.length})
              </button>
              <button
                onClick={() => { setActiveTab('partners'); setSearchQuery(''); }}
                className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-colors text-sm md:text-base ${
                  activeTab === 'partners'
                    ? 'text-[#5f7ab8] border-b-2 border-[#5f7ab8]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Đối tác ({partnerLogos.length})
              </button>
              <button
                onClick={() => { setActiveTab('settings'); setSearchQuery(''); }}
                className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-colors text-sm md:text-base ${
                  activeTab === 'settings'
                    ? 'text-[#5f7ab8] border-b-2 border-[#5f7ab8]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Bảo mật
              </button>
            </div>
          </div>

          {/* Search & Filter Bar - Only show for products and posts */}
          {(activeTab === 'products' || activeTab === 'posts') && (
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
          )}

          {/* Action Bar - Only show for products and posts */}
          {(activeTab === 'products' || activeTab === 'posts') && (
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
                  disabled={saving}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50"
                >
                  Chỉnh sửa hàng loạt
                </button>
                <button
                  onClick={bulkDeleteProducts}
                  disabled={saving}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
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
                  disabled={saving}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
                >
                  Xóa đã chọn
                </button>
              </>
            )}
          </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
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
                            disabled={saving}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden">
                {/* Select All on Mobile */}
                <div className="p-3 bg-gray-100 border-b flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={filteredProducts.length > 0 && selectedProducts.size === filteredProducts.length}
                    onChange={selectAllProducts}
                    className="w-4 h-4 rounded border-gray-300 text-[#5f7ab8] focus:ring-[#5f7ab8]"
                  />
                  <span className="text-sm text-gray-600">Chọn tất cả</span>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className={`p-4 ${selectedProducts.has(product.id) ? 'bg-blue-50' : ''}`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                          className="w-4 h-4 mt-1 rounded border-gray-300 text-[#5f7ab8] focus:ring-[#5f7ab8]"
                        />
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">ID: {product.id}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600">{product.categoryName || product.category}</span>
                            {product.featured && (
                              <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold text-green-700 bg-green-100 rounded">Nổi bật</span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900 mt-1">{product.price}</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-4 mt-3 pt-3 border-t border-gray-100">
                        <Link
                          href={`/admin/product/${product.id}`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          disabled={saving}
                          className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Không tìm thấy sản phẩm nào
                </div>
              )}
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
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
                            disabled={saving}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden">
                {/* Select All on Mobile */}
                <div className="p-3 bg-gray-100 border-b flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={filteredPosts.length > 0 && selectedPosts.size === filteredPosts.length}
                    onChange={selectAllPosts}
                    className="w-4 h-4 rounded border-gray-300 text-[#5f7ab8] focus:ring-[#5f7ab8]"
                  />
                  <span className="text-sm text-gray-600">Chọn tất cả</span>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className={`p-4 ${selectedPosts.has(post.id) ? 'bg-blue-50' : ''}`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedPosts.has(post.id)}
                          onChange={() => togglePostSelection(post.id)}
                          className="w-4 h-4 mt-1 rounded border-gray-300 text-[#5f7ab8] focus:ring-[#5f7ab8]"
                        />
                        <img src={post.image} alt={post.title} className="w-16 h-16 object-cover rounded flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{post.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">ID: {post.id}</p>
                          <p className="text-xs text-gray-600 mt-1">{post.date}</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-4 mt-3 pt-3 border-t border-gray-100">
                        <Link
                          href={`/admin/post/${post.id}`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => deletePost(post.id)}
                          disabled={saving}
                          className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Không tìm thấy bài viết nào
                </div>
              )}
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Quản lý danh mục sản phẩm</h2>
                <button
                  onClick={openAddCategoryModal}
                  disabled={saving}
                  className="px-4 py-2 bg-[#5f7ab8] text-white rounded-lg hover:bg-[#4a6199] transition-colors font-medium disabled:opacity-50"
                >
                  + Thêm danh mục
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hình ảnh</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tên danh mục</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Slug</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mô tả</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Số sản phẩm</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.map((category) => {
                      const productCount = products.filter(p => p.category === category.slug).length;
                      return (
                        <tr key={category.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{category.id}</td>
                          <td className="px-6 py-4">
                            {category.image ? (
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 p-1 border border-gray-200">
                                <img
                                  src={category.image}
                                  alt={category.name}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/images/box-image/MAY.jpg';
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                N/A
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-900">{category.name}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-mono">{category.slug}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-[250px] truncate">
                            {category.description || '-'}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                              productCount > 0 ? 'text-blue-700 bg-blue-100' : 'text-gray-500 bg-gray-100'
                            }`}>
                              {productCount}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <a
                              href={`/san-pham/${category.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 mr-3"
                            >
                              Xem
                            </a>
                            <button
                              onClick={() => openEditCategoryModal(category)}
                              disabled={saving}
                              className="text-blue-600 hover:text-blue-800 mr-3 disabled:opacity-50"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => deleteCategory(category.id)}
                              disabled={saving}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {categories.map((category) => {
                  const productCount = products.filter(p => p.category === category.slug).length;
                  return (
                    <div key={category.id} className="p-4">
                      <div className="flex items-start gap-3">
                        {category.image ? (
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 p-1 border border-gray-200 flex-shrink-0">
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/box-image/MAY.jpg';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                            N/A
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                          <p className="text-xs text-gray-500 mt-1 font-mono">{category.slug}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                              productCount > 0 ? 'text-blue-700 bg-blue-100' : 'text-gray-500 bg-gray-100'
                            }`}>
                              {productCount} sản phẩm
                            </span>
                          </div>
                          {category.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{category.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end gap-4 mt-3 pt-3 border-t border-gray-100">
                        <a
                          href={`/san-pham/${category.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-600 hover:text-green-800 font-medium"
                        >
                          Xem
                        </a>
                        <button
                          onClick={() => openEditCategoryModal(category)}
                          disabled={saving}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteCategory(category.id)}
                          disabled={saving}
                          className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {categories.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Chưa có danh mục nào
                </div>
              )}
            </div>
          )}

          {/* Site Settings Tab */}
          {activeTab === 'site-settings' && (
            <div className="space-y-6">
              {/* Site Settings Form */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Cài đặt Website</h2>
                </div>
                <div className="p-6">
                  {siteSettings && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên công ty</label>
                        <input
                          type="text"
                          value={siteSettings.companyName}
                          onChange={(e) => setSiteSettings({ ...siteSettings, companyName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
                        <input
                          type="text"
                          value={siteSettings.companySlogan}
                          onChange={(e) => setSiteSettings({ ...siteSettings, companySlogan: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả công ty</label>
                        <textarea
                          value={siteSettings.companyDescription}
                          onChange={(e) => setSiteSettings({ ...siteSettings, companyDescription: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <input
                          type="text"
                          value={siteSettings.phone}
                          onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={siteSettings.email}
                          onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hotline</label>
                        <input
                          type="text"
                          value={siteSettings.hotline || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, hotline: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                        <input
                          type="text"
                          value={siteSettings.logo}
                          onChange={(e) => setSiteSettings({ ...siteSettings, logo: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Copyright</label>
                        <input
                          type="text"
                          value={siteSettings.copyright}
                          onChange={(e) => setSiteSettings({ ...siteSettings, copyright: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                  <div className="mt-6">
                    <button
                      onClick={async () => {
                        if (!siteSettings) return;
                        setSaving(true);
                        try {
                          const res = await fetch('/api/site-settings', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(siteSettings),
                          });
                          if (res.ok) {
                            toast.success('Đã lưu cài đặt website!');
                          } else {
                            toast.error('Có lỗi xảy ra');
                          }
                        } catch {
                          toast.error('Có lỗi xảy ra');
                        } finally {
                          setSaving(false);
                        }
                      }}
                      disabled={saving}
                      className="px-6 py-2 bg-[#5f7ab8] text-white rounded-lg hover:bg-[#4a6199] transition-colors font-medium disabled:opacity-50"
                    >
                      {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Office Locations */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Địa chỉ văn phòng ({officeLocations.length})</h2>
                  <button
                    onClick={async () => {
                      const newOffice: OfficeLocation = {
                        id: String(Date.now()),
                        name: 'Văn phòng mới',
                        type: 'branch',
                        region: 'Miền Nam',
                        address: '',
                        order: officeLocations.length + 1,
                      };
                      setSaving(true);
                      try {
                        const res = await fetch('/api/office-locations', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(newOffice),
                        });
                        if (res.ok) {
                          await loadData();
                          toast.success('Đã thêm văn phòng mới!');
                        }
                      } catch {
                        toast.error('Có lỗi xảy ra');
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="px-4 py-2 bg-[#5f7ab8] text-white rounded-lg hover:bg-[#4a6199] transition-colors font-medium text-sm disabled:opacity-50"
                  >
                    + Thêm văn phòng
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {officeLocations.map((office) => (
                    <div key={office.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                          type="text"
                          value={office.name}
                          onChange={(e) => {
                            setOfficeLocations(officeLocations.map(o =>
                              o.id === office.id ? { ...o, name: e.target.value } : o
                            ));
                          }}
                          placeholder="Tên văn phòng"
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <select
                          value={office.type}
                          onChange={(e) => {
                            setOfficeLocations(officeLocations.map(o =>
                              o.id === office.id ? { ...o, type: e.target.value as 'headquarters' | 'branch' } : o
                            ));
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="headquarters">Trụ sở chính</option>
                          <option value="branch">Chi nhánh</option>
                        </select>
                        <input
                          type="text"
                          value={office.region}
                          onChange={(e) => {
                            setOfficeLocations(officeLocations.map(o =>
                              o.id === office.id ? { ...o, region: e.target.value } : o
                            ));
                          }}
                          placeholder="Khu vực"
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              setSaving(true);
                              try {
                                const res = await fetch('/api/office-locations', {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(office),
                                });
                                if (res.ok) toast.success('Đã lưu!');
                              } catch {
                                toast.error('Có lỗi xảy ra');
                              } finally {
                                setSaving(false);
                              }
                            }}
                            disabled={saving}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={async () => {
                              const confirmed = await toast.confirm({
                                title: 'Xác nhận xóa',
                                message: `Bạn có chắc muốn xóa văn phòng "${office.name}"?`,
                                confirmText: 'Xóa',
                                type: 'danger'
                              });
                              if (!confirmed) return;
                              setSaving(true);
                              try {
                                const res = await fetch(`/api/office-locations?id=${office.id}`, { method: 'DELETE' });
                                if (res.ok) {
                                  await loadData();
                                  toast.success('Đã xóa!');
                                }
                              } catch {
                                toast.error('Có lỗi xảy ra');
                              } finally {
                                setSaving(false);
                              }
                            }}
                            disabled={saving}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <input
                          type="text"
                          value={office.address}
                          onChange={(e) => {
                            setOfficeLocations(officeLocations.map(o =>
                              o.id === office.id ? { ...o, address: e.target.value } : o
                            ));
                          }}
                          placeholder="Địa chỉ đầy đủ"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={office.phone || ''}
                          onChange={(e) => {
                            setOfficeLocations(officeLocations.map(o =>
                              o.id === office.id ? { ...o, phone: e.target.value } : o
                            ));
                          }}
                          placeholder="Số điện thoại"
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                          type="email"
                          value={office.email || ''}
                          onChange={(e) => {
                            setOfficeLocations(officeLocations.map(o =>
                              o.id === office.id ? { ...o, email: e.target.value } : o
                            ));
                          }}
                          placeholder="Email"
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Google Maps Embed URL</label>
                        <input
                          type="text"
                          value={office.googleMapsUrl || ''}
                          onChange={(e) => {
                            setOfficeLocations(officeLocations.map(o =>
                              o.id === office.id ? { ...o, googleMapsUrl: e.target.value } : o
                            ));
                          }}
                          placeholder="https://www.google.com/maps/embed?pb=..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <p className="text-xs text-gray-400 mt-1">Mở Google Maps → Share → Embed a map → Copy URL trong src</p>
                      </div>
                    </div>
                  ))}
                  {officeLocations.length === 0 && (
                    <div className="p-8 text-center text-gray-500">Chưa có văn phòng nào</div>
                  )}
                </div>
              </div>

              {/* Hero Slides */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Hero Slides ({heroSlides.length})</h2>
                  <button
                    onClick={async () => {
                      const newSlide: HeroSlide = {
                        id: String(Date.now()),
                        title: 'Slide mới',
                        subtitle: '',
                        label: '',
                        description: '',
                        image: '/images/hero/slide1.jpg',
                        video: '',
                        link: '/',
                        linkText: 'Xem thêm',
                        order: heroSlides.length + 1,
                        enabled: true,
                      };
                      setSaving(true);
                      try {
                        const res = await fetch('/api/hero-slides', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(newSlide),
                        });
                        if (res.ok) {
                          await loadData();
                          toast.success('Đã thêm slide mới!');
                        }
                      } catch {
                        toast.error('Có lỗi xảy ra');
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="px-4 py-2 bg-[#5f7ab8] text-white rounded-lg hover:bg-[#4a6199] transition-colors font-medium text-sm disabled:opacity-50"
                  >
                    + Thêm slide
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {heroSlides.map((slide) => (
                    <div key={slide.id} className="p-4">
                      <div className="flex flex-col lg:flex-row gap-4">
                        {/* Preview */}
                        <div className="flex-shrink-0">
                          {slide.video ? (
                            <video src={slide.video} className="w-40 h-24 object-cover rounded" muted playsInline />
                          ) : (
                            <img src={slide.image} alt={slide.title} className="w-40 h-24 object-cover rounded" />
                          )}
                        </div>

                        {/* Form Fields */}
                        <div className="flex-1 space-y-3">
                          {/* Row 1: Title & Subtitle */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Tiêu đề chính</label>
                              <input
                                type="text"
                                value={slide.title}
                                onChange={(e) => {
                                  setHeroSlides(heroSlides.map(s =>
                                    s.id === slide.id ? { ...s, title: e.target.value } : s
                                  ));
                                }}
                                placeholder="Tiêu đề"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Tiêu đề phụ</label>
                              <input
                                type="text"
                                value={slide.subtitle || ''}
                                onChange={(e) => {
                                  setHeroSlides(heroSlides.map(s =>
                                    s.id === slide.id ? { ...s, subtitle: e.target.value } : s
                                  ));
                                }}
                                placeholder="Tiêu đề phụ"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                          </div>

                          {/* Row 2: Label & Link Text */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Nhãn (Label)</label>
                              <input
                                type="text"
                                value={slide.label || ''}
                                onChange={(e) => {
                                  setHeroSlides(heroSlides.map(s =>
                                    s.id === slide.id ? { ...s, label: e.target.value } : s
                                  ));
                                }}
                                placeholder="VD: GIỚI THIỆU"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Text nút bấm</label>
                              <input
                                type="text"
                                value={slide.linkText}
                                onChange={(e) => {
                                  setHeroSlides(heroSlides.map(s =>
                                    s.id === slide.id ? { ...s, linkText: e.target.value } : s
                                  ));
                                }}
                                placeholder="Xem thêm"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                          </div>

                          {/* Row 3: Description */}
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Mô tả</label>
                            <textarea
                              value={slide.description}
                              onChange={(e) => {
                                setHeroSlides(heroSlides.map(s =>
                                  s.id === slide.id ? { ...s, description: e.target.value } : s
                                ));
                              }}
                              placeholder="Mô tả ngắn về slide"
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>

                          {/* Row 4: Image Upload */}
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Hình ảnh nền</label>
                            <ImageUpload
                              value={slide.image}
                              onChange={(value) => {
                                setHeroSlides(heroSlides.map(s =>
                                  s.id === slide.id ? { ...s, image: value } : s
                                ));
                              }}
                              placeholder="URL hình ảnh hoặc upload"
                              showPreview={false}
                            />
                          </div>

                          {/* Row 5: Video Upload */}
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Video nền (tùy chọn)</label>
                            <ImageUpload
                              value={slide.video || ''}
                              onChange={(value) => {
                                setHeroSlides(heroSlides.map(s =>
                                  s.id === slide.id ? { ...s, video: value } : s
                                ));
                              }}
                              accept="video/*"
                              placeholder="URL video hoặc upload (mp4, webm)"
                              showPreview={false}
                            />
                          </div>

                          {/* Row 6: Link & Actions */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Đường dẫn</label>
                              <input
                                type="text"
                                value={slide.link}
                                onChange={(e) => {
                                  setHeroSlides(heroSlides.map(s =>
                                    s.id === slide.id ? { ...s, link: e.target.value } : s
                                  ));
                                }}
                                placeholder="/san-pham"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Thứ tự</label>
                              <input
                                type="number"
                                value={slide.order}
                                onChange={(e) => {
                                  setHeroSlides(heroSlides.map(s =>
                                    s.id === slide.id ? { ...s, order: parseInt(e.target.value) || 1 } : s
                                  ));
                                }}
                                min={1}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={slide.enabled}
                                  onChange={(e) => {
                                    setHeroSlides(heroSlides.map(s =>
                                      s.id === slide.id ? { ...s, enabled: e.target.checked } : s
                                    ));
                                  }}
                                  className="w-4 h-4 rounded"
                                />
                                <span className="text-sm">Hiển thị</span>
                              </label>
                              <button
                                onClick={async () => {
                                  setSaving(true);
                                  try {
                                    const res = await fetch('/api/hero-slides', {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify(slide),
                                    });
                                    if (res.ok) toast.success('Đã lưu!');
                                  } catch {
                                    toast.error('Có lỗi xảy ra');
                                  } finally {
                                    setSaving(false);
                                  }
                                }}
                                disabled={saving}
                                className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                              >
                                Lưu
                              </button>
                              <button
                                onClick={async () => {
                                  const confirmed = await toast.confirm({
                                    title: 'Xác nhận xóa',
                                    message: 'Bạn có chắc muốn xóa slide này?',
                                    confirmText: 'Xóa',
                                    type: 'danger'
                                  });
                                  if (!confirmed) return;
                                  setSaving(true);
                                  try {
                                    const res = await fetch(`/api/hero-slides?id=${slide.id}`, { method: 'DELETE' });
                                    if (res.ok) {
                                      await loadData();
                                      toast.success('Đã xóa!');
                                    }
                                  } catch {
                                    toast.error('Có lỗi xảy ra');
                                  } finally {
                                    setSaving(false);
                                  }
                                }}
                                disabled={saving}
                                className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {heroSlides.length === 0 && (
                    <div className="p-8 text-center text-gray-500">Chưa có slide nào</div>
                  )}
                </div>
              </div>

              {/* Homepage Stats */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Số liệu trang chủ ({homepageStats.length})</h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {homepageStats.map((stat, index) => (
                      <div key={stat.id} className="border border-gray-200 rounded-lg p-4">
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            setHomepageStats(homepageStats.map((s, i) =>
                              i === index ? { ...s, label: e.target.value } : s
                            ));
                          }}
                          placeholder="Label"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              setHomepageStats(homepageStats.map((s, i) =>
                                i === index ? { ...s, value: e.target.value } : s
                              ));
                            }}
                            placeholder="Giá trị"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                          <input
                            type="text"
                            value={stat.suffix || ''}
                            onChange={(e) => {
                              setHomepageStats(homepageStats.map((s, i) =>
                                i === index ? { ...s, suffix: e.target.value } : s
                              ));
                            }}
                            placeholder="Hậu tố"
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={async () => {
                        setSaving(true);
                        try {
                          const res = await fetch('/api/homepage-stats', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(homepageStats),
                          });
                          if (res.ok) toast.success('Đã lưu số liệu!');
                        } catch {
                          toast.error('Có lỗi xảy ra');
                        } finally {
                          setSaving(false);
                        }
                      }}
                      disabled={saving}
                      className="px-6 py-2 bg-[#5f7ab8] text-white rounded-lg hover:bg-[#4a6199] transition-colors font-medium disabled:opacity-50"
                    >
                      {saving ? 'Đang lưu...' : 'Lưu số liệu'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Quản lý thư viện hình ảnh</h2>
                <button
                  onClick={async () => {
                    const newImage: GalleryImage = {
                      id: String(Date.now()),
                      src: '/images/gallery/image.jpg',
                      alt: 'Hình ảnh mới',
                      title: 'Hình ảnh mới',
                      description: '',
                      category: 'general',
                      tags: [],
                      featured: false,
                      order: galleryImages.length + 1,
                    };
                    setSaving(true);
                    try {
                      const res = await fetch('/api/gallery', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newImage),
                      });
                      if (res.ok) {
                        await loadData();
                        toast.success('Đã thêm hình ảnh mới!');
                      }
                    } catch {
                      toast.error('Có lỗi xảy ra');
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  className="px-4 py-2 bg-[#5f7ab8] text-white rounded-lg hover:bg-[#4a6199] transition-colors font-medium disabled:opacity-50"
                >
                  + Thêm hình ảnh
                </button>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <img src={image.src} alt={image.alt} className="w-full h-40 object-cover" />
                      <div className="p-3 space-y-2">
                        {/* Image Upload */}
                        <ImageUpload
                          value={image.src}
                          onChange={(value) => {
                            setGalleryImages(galleryImages.map(img =>
                              img.id === image.id ? { ...img, src: value } : img
                            ));
                          }}
                          placeholder="URL hình ảnh hoặc upload"
                          showPreview={false}
                        />
                        <input
                          type="text"
                          value={image.title || ''}
                          onChange={(e) => {
                            setGalleryImages(galleryImages.map(img =>
                              img.id === image.id ? { ...img, title: e.target.value } : img
                            ));
                          }}
                          placeholder="Tiêu đề"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) => {
                            setGalleryImages(galleryImages.map(img =>
                              img.id === image.id ? { ...img, alt: e.target.value } : img
                            ));
                          }}
                          placeholder="Alt text"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          value={image.description || ''}
                          onChange={(e) => {
                            setGalleryImages(galleryImages.map(img =>
                              img.id === image.id ? { ...img, description: e.target.value } : img
                            ));
                          }}
                          placeholder="Mô tả"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={image.category || ''}
                            onChange={(e) => {
                              setGalleryImages(galleryImages.map(img =>
                                img.id === image.id ? { ...img, category: e.target.value } : img
                              ));
                            }}
                            placeholder="Danh mục"
                            className="px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="number"
                            value={image.order}
                            onChange={(e) => {
                              setGalleryImages(galleryImages.map(img =>
                                img.id === image.id ? { ...img, order: parseInt(e.target.value) || 1 } : img
                              ));
                            }}
                            placeholder="Thứ tự"
                            min={1}
                            className="px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-1 text-sm">
                            <input
                              type="checkbox"
                              checked={image.featured}
                              onChange={(e) => {
                                setGalleryImages(galleryImages.map(img =>
                                  img.id === image.id ? { ...img, featured: e.target.checked } : img
                                ));
                              }}
                              className="w-4 h-4 rounded"
                            />
                            Nổi bật
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                setSaving(true);
                                try {
                                  const res = await fetch('/api/gallery', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(image),
                                  });
                                  if (res.ok) toast.success('Đã lưu!');
                                } catch {
                                  toast.error('Có lỗi xảy ra');
                                } finally {
                                  setSaving(false);
                                }
                              }}
                              disabled={saving}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={async () => {
                                const confirmed = await toast.confirm({
                                  title: 'Xác nhận xóa',
                                  message: 'Bạn có chắc muốn xóa hình ảnh này?',
                                  confirmText: 'Xóa',
                                  type: 'danger'
                                });
                                if (!confirmed) return;
                                setSaving(true);
                                try {
                                  const res = await fetch(`/api/gallery?id=${image.id}`, { method: 'DELETE' });
                                  if (res.ok) {
                                    await loadData();
                                    toast.success('Đã xóa!');
                                  }
                                } catch {
                                  toast.error('Có lỗi xảy ra');
                                } finally {
                                  setSaving(false);
                                }
                              }}
                              disabled={saving}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {galleryImages.length === 0 && (
                  <div className="text-center py-12 text-gray-500">Chưa có hình ảnh nào</div>
                )}
              </div>
            </div>
          )}

          {/* Catalogs Tab */}
          {activeTab === 'catalogs' && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Quản lý Catalogs</h2>
                <button
                  onClick={async () => {
                    const newCatalog: Catalog = {
                      id: String(Date.now()),
                      title: 'Catalog mới',
                      description: '',
                      brand: 'HIAB',
                      downloadUrl: '/catalogs/catalog.pdf',
                      thumbnail: '',
                      order: catalogs.length + 1,
                      enabled: true,
                    };
                    setSaving(true);
                    try {
                      const res = await fetch('/api/catalogs', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newCatalog),
                      });
                      if (res.ok) {
                        await loadData();
                        toast.success('Đã thêm catalog mới!');
                      }
                    } catch {
                      toast.error('Có lỗi xảy ra');
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  className="px-4 py-2 bg-[#5f7ab8] text-white rounded-lg hover:bg-[#4a6199] transition-colors font-medium disabled:opacity-50"
                >
                  + Thêm catalog
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tiêu đề</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Thương hiệu</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">URL Download</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Hiển thị</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {catalogs.map((catalog) => (
                      <tr key={catalog.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={catalog.title}
                            onChange={(e) => {
                              setCatalogs(catalogs.map(c =>
                                c.id === catalog.id ? { ...c, title: e.target.value } : c
                              ));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={catalog.brand}
                            onChange={(e) => {
                              setCatalogs(catalogs.map(c =>
                                c.id === catalog.id ? { ...c, brand: e.target.value } : c
                              ));
                            }}
                            className="px-3 py-2 border border-gray-300 rounded text-sm"
                          >
                            <option value="HIAB">HIAB</option>
                            <option value="WILL-BURT">WILL-BURT</option>
                            <option value="Moffett">Moffett</option>
                            <option value="EFFER">EFFER</option>
                            <option value="Other">Khác</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={catalog.downloadUrl}
                            onChange={(e) => {
                              setCatalogs(catalogs.map(c =>
                                c.id === catalog.id ? { ...c, downloadUrl: e.target.value } : c
                              ));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={catalog.enabled}
                            onChange={(e) => {
                              setCatalogs(catalogs.map(c =>
                                c.id === catalog.id ? { ...c, enabled: e.target.checked } : c
                              ));
                            }}
                            className="w-4 h-4 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={async () => {
                              setSaving(true);
                              try {
                                const res = await fetch('/api/catalogs', {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(catalog),
                                });
                                if (res.ok) toast.success('Đã lưu!');
                              } catch {
                                toast.error('Có lỗi xảy ra');
                              } finally {
                                setSaving(false);
                              }
                            }}
                            disabled={saving}
                            className="text-green-600 hover:text-green-800 mr-3 disabled:opacity-50"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={async () => {
                              const confirmed = await toast.confirm({
                                title: 'Xác nhận xóa',
                                message: `Bạn có chắc muốn xóa catalog "${catalog.title}"?`,
                                confirmText: 'Xóa',
                                type: 'danger'
                              });
                              if (!confirmed) return;
                              setSaving(true);
                              try {
                                const res = await fetch(`/api/catalogs?id=${catalog.id}`, { method: 'DELETE' });
                                if (res.ok) {
                                  await loadData();
                                  toast.success('Đã xóa!');
                                }
                              } catch {
                                toast.error('Có lỗi xảy ra');
                              } finally {
                                setSaving(false);
                              }
                            }}
                            disabled={saving}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {catalogs.length === 0 && (
                <div className="text-center py-12 text-gray-500">Chưa có catalog nào</div>
              )}
            </div>
          )}

          {/* Partners Tab */}
          {activeTab === 'partners' && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Quản lý đối tác</h2>
                <button
                  onClick={async () => {
                    const newPartner: PartnerLogo = {
                      id: String(Date.now()),
                      name: 'Đối tác mới',
                      logo: '/images/partners/logo.png',
                      url: '',
                      order: partnerLogos.length + 1,
                      enabled: true,
                    };
                    setSaving(true);
                    try {
                      const res = await fetch('/api/partner-logos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newPartner),
                      });
                      if (res.ok) {
                        await loadData();
                        toast.success('Đã thêm đối tác mới!');
                      }
                    } catch {
                      toast.error('Có lỗi xảy ra');
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  className="px-4 py-2 bg-[#5f7ab8] text-white rounded-lg hover:bg-[#4a6199] transition-colors font-medium disabled:opacity-50"
                >
                  + Thêm đối tác
                </button>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partnerLogos.map((partner) => (
                    <div key={partner.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <img src={partner.logo} alt={partner.name} className="w-16 h-16 object-contain bg-gray-100 rounded p-2" />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={partner.name}
                            onChange={(e) => {
                              setPartnerLogos(partnerLogos.map(p =>
                                p.id === partner.id ? { ...p, name: e.target.value } : p
                              ));
                            }}
                            placeholder="Tên đối tác"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        {/* Logo Upload */}
                        <ImageUpload
                          value={partner.logo}
                          onChange={(value) => {
                            setPartnerLogos(partnerLogos.map(p =>
                              p.id === partner.id ? { ...p, logo: value } : p
                            ));
                          }}
                          placeholder="URL logo hoặc upload"
                          showPreview={false}
                        />
                        <input
                          type="text"
                          value={partner.url || ''}
                          onChange={(e) => {
                            setPartnerLogos(partnerLogos.map(p =>
                              p.id === partner.id ? { ...p, url: e.target.value } : p
                            ));
                          }}
                          placeholder="URL website"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            value={partner.order}
                            onChange={(e) => {
                              setPartnerLogos(partnerLogos.map(p =>
                                p.id === partner.id ? { ...p, order: parseInt(e.target.value) || 1 } : p
                              ));
                            }}
                            placeholder="Thứ tự"
                            min={1}
                            className="px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={partner.enabled}
                              onChange={(e) => {
                                setPartnerLogos(partnerLogos.map(p =>
                                  p.id === partner.id ? { ...p, enabled: e.target.checked } : p
                                ));
                              }}
                              className="w-4 h-4 rounded"
                            />
                            Hiển thị
                          </label>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={async () => {
                              setSaving(true);
                              try {
                                const res = await fetch('/api/partner-logos', {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(partner),
                                });
                                if (res.ok) toast.success('Đã lưu!');
                              } catch {
                                toast.error('Có lỗi xảy ra');
                              } finally {
                                setSaving(false);
                              }
                            }}
                            disabled={saving}
                            className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={async () => {
                              const confirmed = await toast.confirm({
                                title: 'Xác nhận xóa',
                                message: `Bạn có chắc muốn xóa đối tác "${partner.name}"?`,
                                confirmText: 'Xóa',
                                type: 'danger'
                              });
                              if (!confirmed) return;
                              setSaving(true);
                              try {
                                const res = await fetch(`/api/partner-logos?id=${partner.id}`, { method: 'DELETE' });
                                if (res.ok) {
                                  await loadData();
                                  toast.success('Đã xóa!');
                                }
                              } catch {
                                toast.error('Có lỗi xảy ra');
                              } finally {
                                setSaving(false);
                              }
                            }}
                            disabled={saving}
                            className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {partnerLogos.length === 0 && (
                  <div className="text-center py-12 text-gray-500">Chưa có đối tác nào</div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Cài đặt bảo mật</h2>
                <p className="text-gray-600 mt-1">Quản lý xác thực hai yếu tố (2FA) với Google Authenticator</p>
              </div>

              <div className="p-6">
                {/* TOTP Status */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${totpEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <svg className={`w-6 h-6 ${totpEnabled ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Google Authenticator</h3>
                      <p className={`text-sm ${totpEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                        {totpEnabled ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                      </p>
                    </div>
                  </div>

                  {totpEnabled ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm mb-3">
                        Xác thực hai yếu tố đang được bật. Mỗi lần đăng nhập, bạn sẽ cần nhập mã từ ứng dụng Google Authenticator.
                      </p>
                      <button
                        onClick={() => { setShowDisableModal(true); setTotpError(''); setTotpPassword(''); setTotpDisableCode(''); }}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Tắt Google Authenticator
                      </button>
                    </div>
                  ) : totpSetupData ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Bước 2: Quét mã QR</h4>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <img src={totpSetupData.qrCode} alt="QR Code" className="w-48 h-48 border border-gray-300 rounded-lg" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 text-sm mb-3">
                            1. Mở ứng dụng Google Authenticator trên điện thoại
                          </p>
                          <p className="text-gray-700 text-sm mb-3">
                            2. Nhấn nút + và chọn &quot;Quét mã QR&quot;
                          </p>
                          <p className="text-gray-700 text-sm mb-4">
                            3. Quét mã QR bên trái, sau đó nhập mã 6 số hiển thị
                          </p>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hoặc nhập thủ công:</label>
                            <code className="block bg-gray-100 px-3 py-2 rounded text-sm font-mono break-all">{totpSetupData.secret}</code>
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={totpVerifyCode}
                              onChange={(e) => setTotpVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5f7ab8] text-center text-lg tracking-widest font-mono"
                              placeholder="000000"
                              maxLength={6}
                              inputMode="numeric"
                            />
                            <button
                              onClick={handleTotpVerifySetup}
                              disabled={totpLoading || totpVerifyCode.length !== 6}
                              className="px-6 py-2 bg-[#5f7ab8] text-white rounded hover:bg-[#4a6199] transition-colors font-medium disabled:opacity-50"
                            >
                              {totpLoading ? 'Đang xử lý...' : 'Xác nhận'}
                            </button>
                          </div>

                          {totpError && (
                            <p className="mt-2 text-red-600 text-sm">{totpError}</p>
                          )}

                          <button
                            onClick={() => { setTotpSetupData(null); setTotpVerifyCode(''); setTotpError(''); }}
                            className="mt-4 text-gray-600 hover:text-gray-800 text-sm"
                          >
                            Hủy thiết lập
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Bước 1: Xác nhận mật khẩu</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Để thiết lập xác thực hai yếu tố, vui lòng nhập mật khẩu admin để xác nhận.
                      </p>
                      <div className="flex gap-2 max-w-md">
                        <PasswordInput
                          id="totp-setup-password"
                          value={totpPassword}
                          onChange={(e) => setTotpPassword(e.target.value)}
                          placeholder="Nhập mật khẩu admin"
                          showLabel={false}
                          className="flex-1"
                        />
                        <button
                          onClick={handleTotpSetup}
                          disabled={totpLoading || !totpPassword}
                          className="px-6 py-2 bg-[#5f7ab8] text-white rounded hover:bg-[#4a6199] transition-colors font-medium disabled:opacity-50"
                        >
                          {totpLoading ? 'Đang xử lý...' : 'Tiếp tục'}
                        </button>
                      </div>
                      {totpError && (
                        <p className="mt-2 text-red-600 text-sm">{totpError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Về xác thực hai yếu tố</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Tại sao nên sử dụng?</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>- Bảo vệ tài khoản admin khỏi truy cập trái phép</li>
                        <li>- Ngay cả khi mật khẩu bị lộ, kẻ tấn công vẫn không thể đăng nhập</li>
                        <li>- Tiêu chuẩn bảo mật được khuyến nghị</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Cách hoạt động</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>- Sau khi nhập mật khẩu, bạn cần nhập thêm mã 6 số</li>
                        <li>- Mã được tạo bởi ứng dụng Google Authenticator</li>
                        <li>- Mã thay đổi mỗi 30 giây</li>
                      </ul>
                    </div>
                  </div>
                </div>
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
                disabled={saving}
                className="px-4 py-2 bg-[#5f7ab8] text-white rounded-lg hover:bg-[#4a6199] font-medium disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : 'Áp dụng'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Category Edit Modal */}
      {showCategoryModal && typeof document !== 'undefined' && createPortal(
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
            onClick={() => setShowCategoryModal(false)}
          />

          {/* Modal Content */}
          <div
            style={{
              position: 'relative',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              width: '100%',
              maxWidth: '500px',
              padding: '24px',
              zIndex: 100000
            }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => {
                    setCategoryForm(prev => ({
                      ...prev,
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    }));
                  }}
                  placeholder="VD: Cột Tự Nâng WILL-BURT"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="VD: cot-tu-nang-will-burt"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent font-mono text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Để trống để tự động tạo từ tên</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả ngắn về danh mục..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh danh mục</label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Check file size (max 100MB)
                          if (file.size > 100 * 1024 * 1024) {
                            toast.warning('Hình ảnh không được vượt quá 100MB');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCategoryForm(prev => ({ ...prev, image: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#5f7ab8] file:text-white hover:file:bg-[#4a6199] file:cursor-pointer"
                    />
                    <p className="mt-1 text-xs text-gray-500">Chọn hình ảnh (tối đa 100MB, định dạng JPG, PNG, GIF)</p>
                  </div>
                  {categoryForm.image && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50 p-1">
                      <img
                        src={categoryForm.image}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setCategoryForm(prev => ({ ...prev, image: '' }))}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={saveCategory}
                disabled={saving}
                className="px-4 py-2 bg-[#5f7ab8] text-white rounded-lg hover:bg-[#4a6199] font-medium disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : (editingCategory ? 'Cập nhật' : 'Thêm mới')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Disable TOTP Modal */}
      {showDisableModal && typeof document !== 'undefined' && createPortal(
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
            onClick={() => setShowDisableModal(false)}
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
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Tắt Google Authenticator</h2>
              <p className="text-gray-600 text-sm">
                Điều này sẽ giảm bảo mật cho tài khoản admin của bạn.
              </p>
            </div>

            <div className="space-y-4">
              <PasswordInput
                id="totp-disable-password"
                value={totpPassword}
                onChange={(e) => setTotpPassword(e.target.value)}
                placeholder="Nhập mật khẩu admin"
                label="Mật khẩu admin"
                inputClassName="rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã xác thực hiện tại</label>
                <input
                  type="text"
                  value={totpDisableCode}
                  onChange={(e) => setTotpDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent text-center text-lg tracking-widest font-mono"
                  placeholder="000000"
                  maxLength={6}
                  inputMode="numeric"
                />
              </div>

              {totpError && (
                <p className="text-red-600 text-sm">{totpError}</p>
              )}
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => { setShowDisableModal(false); setTotpPassword(''); setTotpDisableCode(''); setTotpError(''); }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleTotpDisable}
                disabled={totpLoading || !totpPassword || totpDisableCode.length !== 6}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {totpLoading ? 'Đang xử lý...' : 'Tắt 2FA'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
