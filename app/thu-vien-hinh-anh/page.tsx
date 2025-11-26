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
    const cats = ['all', ...Array.from(new Set(galleryImages.map((img) => img.category).filter((c): c is string => !!c)))];
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
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="bg-[#FAFAFA] min-h-screen pt-20 md:pt-24 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-100/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* Header Section */}
        <div className="relative z-10 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                Thư viện hình ảnh
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                Thư viện <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">Hình ảnh</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Khám phá bộ sưu tập hình ảnh về các dự án, sản phẩm và hoạt động của New Atlantic.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row gap-6 mb-10 items-start lg:items-center justify-between">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 max-w-full scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                    px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                    ${selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-purple-200'
                    }
                  `}
                >
                  {cat === 'all' ? 'Tất cả' : cat}
                </button>
              ))}
            </div>

            {/* Search & View Toggle */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
                />
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="flex bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Xem lưới"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('slider')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'slider' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Xem slide"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonLoader key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Không tìm thấy hình ảnh</h3>
              <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => {
                const actualIndex = galleryImages.findIndex((img) => img.src === image.src);
                return (
                  <div
                    key={index}
                    className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => openLightbox(actualIndex)}
                  >
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Category Badge */}
                      {image.category && (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-bold rounded-full shadow-sm">
                            {image.category}
                          </span>
                        </div>
                      )}

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">
                          {image.title || image.alt}
                        </h3>
                        {image.description && (
                          <p className="text-white/80 text-xs line-clamp-2">{image.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Slider View */
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="relative">
                {/* Main Image Container */}
                <div
                  className="relative aspect-[16/9] bg-gray-900 overflow-hidden group"
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-3 transition-all duration-200 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-3 transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Slide Counter */}
                  <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-medium border border-white/10">
                    {currentSlide + 1} / {filteredImages.length}
                  </div>

                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8">
                    <div className="max-w-3xl">
                      <h3 className="text-white text-2xl font-bold mb-2">
                        {filteredImages[currentSlide]?.title || filteredImages[currentSlide]?.alt}
                      </h3>
                      {filteredImages[currentSlide]?.description && (
                        <p className="text-white/80 text-base">
                          {filteredImages[currentSlide].description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {filteredImages.length > 1 && (
                  <div className="bg-white border-t border-gray-100 p-4">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                      {filteredImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`flex-shrink-0 relative rounded-xl overflow-hidden transition-all duration-300 ${currentSlide === index
                            ? 'ring-2 ring-purple-600 ring-offset-2 w-24 h-16 opacity-100'
                            : 'w-24 h-16 opacity-50 hover:opacity-100'
                            }`}
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div >

        {/* Lightbox */}
        {
          selectedImageIndex !== null && (
            <GalleryLightbox
              images={galleryImages}
              currentIndex={selectedImageIndex}
              isOpen={true}
              onClose={closeLightbox}
              onNavigate={handleNavigate}
            />
          )
        }
      </div >
    </>
  );
}
