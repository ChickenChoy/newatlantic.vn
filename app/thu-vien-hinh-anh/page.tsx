'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { generateBreadcrumbSchema } from '@/lib/seo';
import GalleryLightbox from '@/components/GalleryLightbox';
import { SkeletonLoader } from '@/components/SkeletonLoader';

interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
}

type ViewMode = 'slider' | 'grid';

export default function GalleryPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Gallery images with metadata
  const galleryImages: GalleryImage[] = [
    {
      src: '/images/resources/1.png',
      alt: 'Hình ảnh thiết bị 1',
      title: 'Thiết bị công trình',
      description: 'Hình ảnh về thiết bị công trình chất lượng cao',
      category: 'Thiết bị',
      tags: ['thiết bị', 'công trình', 'máy móc'],
    },
    {
      src: '/images/resources/2.png',
      alt: 'Hình ảnh thiết bị 2',
      title: 'Máy móc xây dựng',
      description: 'Máy móc xây dựng hiện đại',
      category: 'Thiết bị',
      tags: ['thiết bị', 'xây dựng', 'máy móc'],
    },
    {
      src: '/images/resources/3.png',
      alt: 'Hình ảnh thiết bị 3',
      title: 'Cẩu tự hành',
      description: 'Cẩu tự hành chất lượng cao',
      category: 'Cẩu',
      tags: ['cẩu', 'nâng hạ', 'thiết bị'],
    },
    {
      src: '/images/resources/4.png',
      alt: 'Hình ảnh thiết bị 4',
      title: 'Thiết bị nâng hạ',
      description: 'Thiết bị nâng hạ chuyên nghiệp',
      category: 'Thiết bị',
      tags: ['thiết bị', 'nâng hạ'],
    },
    {
      src: '/images/resources/5.png',
      alt: 'Hình ảnh thiết bị 5',
      title: 'Cột tự nâng',
      description: 'Cột tự nâng Will-Burt',
      category: 'Cột nâng',
      tags: ['cột', 'nâng', 'will-burt'],
    },
    {
      src: '/images/resources/6.png',
      alt: 'Hình ảnh thiết bị 6',
      title: 'Thiết bị công trình',
      description: 'Thiết bị công trình đa năng',
      category: 'Thiết bị',
      tags: ['thiết bị', 'công trình'],
    },
    {
      src: '/images/resources/7.png',
      alt: 'Hình ảnh thiết bị 7',
      title: 'Máy xúc',
      description: 'Máy xúc công suất lớn',
      category: 'Máy móc',
      tags: ['máy xúc', 'công trình'],
    },
    {
      src: '/images/resources/8.png',
      alt: 'Hình ảnh thiết bị 8',
      title: 'Thiết bị nâng',
      description: 'Thiết bị nâng hiện đại',
      category: 'Thiết bị',
      tags: ['thiết bị', 'nâng'],
    },
    {
      src: '/images/resources/9.png',
      alt: 'Hình ảnh thiết bị 9',
      title: 'Cẩu tháp',
      description: 'Cẩu tháp công nghiệp',
      category: 'Cẩu',
      tags: ['cẩu', 'tháp'],
    },
    {
      src: '/images/resources/10.png',
      alt: 'Hình ảnh thiết bị 10',
      title: 'Thiết bị chuyên dụng',
      description: 'Thiết bị chuyên dụng chất lượng',
      category: 'Thiết bị',
      tags: ['thiết bị', 'chuyên dụng'],
    },
    {
      src: '/images/resources/AIT.jpg',
      alt: 'Hình ảnh AIT',
      title: 'Chứng nhận AIT',
      description: 'Chứng nhận chất lượng AIT',
      category: 'Chứng nhận',
      tags: ['chứng nhận', 'ait', 'chất lượng'],
    },
  ];

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['all', ...Array.from(new Set(galleryImages.map((img) => img.category).filter(Boolean)))];
    return cats;
  }, []);

  // Filter images
  const filteredImages = useMemo(() => {
    return galleryImages.filter((image) => {
      const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        image.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Update page title
  useEffect(() => {
    document.title = 'Thư viện hình ảnh | NEW ATLANTIC - Tân Đại Tây Dương';
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlay || viewMode !== 'slider' || filteredImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % filteredImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, filteredImages.length, viewMode]);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: '/' },
    { name: 'Thư viện hình ảnh', url: '/thu-vien-hinh-anh' },
  ]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % filteredImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const openLightbox = (index: number) => {
    // Scroll to top immediately before opening modal
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Use requestAnimationFrame to ensure scroll happens before modal opens
    requestAnimationFrame(() => {
      setSelectedImageIndex(index);
    });
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const handleNavigate = (index: number) => {
    const actualIndex = filteredImages.findIndex(
      (img) => img.src === galleryImages[index].src
    );
    if (actualIndex !== -1) {
      setCurrentSlide(actualIndex);
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="bg-white min-h-screen pt-20 md:pt-24 relative overflow-hidden">
        {/* Background decorative elements - Subtle purple/violet accent */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-50/40 rounded-full blur-3xl"></div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-white mt-12 md:mt-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-purple-600 transition">
                Trang chủ
              </Link>
              <span>/</span>
              <span className="text-purple-600 font-medium">Thư viện hình ảnh</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium mb-4 tracking-wide uppercase">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Thư viện hình ảnh
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Thư Viện Hình Ảnh
            </h1>
            <p className="text-gray-600 text-lg">
              Khám phá bộ sưu tập hình ảnh thiết bị và sản phẩm của chúng tôi
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm hình ảnh..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex-shrink-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'Tất cả danh mục' : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-label="Xem dạng lưới"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('slider')}
                  className={`px-4 py-3 rounded-lg transition-all ${
                    viewMode === 'slider'
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-label="Xem dạng slider"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Tìm thấy <span className="font-semibold text-[#5f7ab8]">{filteredImages.length}</span> hình ảnh
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <SkeletonLoader key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy hình ảnh</h3>
              <p className="text-gray-600">Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredImages.map((image, index) => {
                const actualIndex = galleryImages.findIndex((img) => img.src === image.src);
                return (
                  <div
                    key={index}
                    className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => openLightbox(actualIndex)}
                  >
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {image.category && (
                          <span className="px-2 py-1 bg-[#5f7ab8] text-white text-xs rounded-full">
                            {image.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {image.title || image.alt}
                      </h3>
                      {image.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Slider View */
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative">
                {/* Main Image Container */}
                <div
                  className="relative aspect-[16/9] bg-gray-100 overflow-hidden"
                  onMouseEnter={() => setIsAutoPlay(false)}
                  onMouseLeave={() => setIsAutoPlay(true)}
                >
                  <div
                    className="flex transition-transform duration-500 ease-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {filteredImages.map((image, index) => {
                      const actualIndex = galleryImages.findIndex((img) => img.src === image.src);
                      return (
                        <div
                          key={index}
                          className="min-w-full h-full relative cursor-pointer"
                          onClick={() => openLightbox(actualIndex)}
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority={index === 0}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  {filteredImages.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
                        aria-label="Ảnh trước"
                      >
                        <svg
                          className="w-6 h-6 text-gray-800"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
                        aria-label="Ảnh sau"
                      >
                        <svg
                          className="w-6 h-6 text-gray-800"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Slide Counter */}
                  {filteredImages.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                      {currentSlide + 1} / {filteredImages.length}
                    </div>
                  )}

                  {/* Image Title */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-white text-lg font-semibold">
                      {filteredImages[currentSlide]?.title || filteredImages[currentSlide]?.alt}
                    </h3>
                    {filteredImages[currentSlide]?.description && (
                      <p className="text-white/80 text-sm mt-1">
                        {filteredImages[currentSlide].description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Thumbnail Navigation */}
                {filteredImages.length > 1 && (
                  <div className="bg-gray-50 p-4">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {filteredImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-300 ${
                            currentSlide === index
                              ? 'ring-4 ring-[#5f7ab8] scale-105'
                              : 'ring-2 ring-transparent hover:ring-gray-300'
                          }`}
                        >
                          <div className="relative w-24 h-16">
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              className={`object-cover transition-opacity duration-300 ${
                                currentSlide === index ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                              }`}
                              sizes="96px"
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dots Indicator */}
                {filteredImages.length > 1 && (
                  <div className="flex justify-center gap-2 py-4 bg-white">
                    {filteredImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${
                          currentSlide === index
                            ? 'bg-[#5f7ab8] w-8 h-2'
                            : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
                        }`}
                        aria-label={`Đi tới slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Lightbox */}
        {selectedImageIndex !== null && (
          <GalleryLightbox
            images={galleryImages}
            currentIndex={selectedImageIndex}
            isOpen={true}
            onClose={closeLightbox}
            onNavigate={handleNavigate}
          />
        )}
      </div>
    </>
  );
}
