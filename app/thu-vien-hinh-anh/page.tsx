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



export default function GalleryPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
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



  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: '/' },
    { name: 'Thư viện hình ảnh', url: '/thu-vien-hinh-anh' },
  ]);



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



  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="bg-[#FAFAFA] min-h-screen pt-24 sm:pt-28 md:pt-32 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-purple-100/40 rounded-full blur-[80px] sm:blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-violet-100/40 rounded-full blur-[80px] sm:blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* Header Section */}
        <div className="relative z-10 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                Thư viện hình ảnh
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
                Thư viện <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">Hình ảnh</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
                Khám phá bộ sưu tập hình ảnh về các dự án, sản phẩm và hoạt động của New Atlantic.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 relative z-10">
          {/* Controls Bar */}
          <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
            {/* Search - Full width on mobile, moved to top for better UX */}
            <div className="relative w-full lg:hidden">
              <input
                type="text"
                placeholder="Tìm kiếm hình ảnh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none shadow-sm"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Categories & Desktop Search */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center justify-between">
              {/* Categories - Horizontal scroll on mobile */}
              <div className="w-full lg:w-auto -mx-4 sm:-mx-6 px-4 sm:px-6 lg:mx-0 lg:px-0">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide snap-x snap-mandatory">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`
                        px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap snap-start flex-shrink-0
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
              </div>

              {/* Search - Desktop only */}
              <div className="hidden lg:block relative w-80">
                <input
                  type="text"
                  placeholder="Tìm kiếm hình ảnh..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
                />
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content Area */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonLoader key={i} className="aspect-square rounded-xl sm:rounded-2xl" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-16 sm:py-20 md:py-24 bg-white rounded-2xl sm:rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Không tìm thấy hình ảnh</h3>
              <p className="text-sm sm:text-base text-gray-500">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {filteredImages.map((image, index) => {
                const actualIndex = galleryImages.findIndex((img) => img.src === image.src);
                return (
                  <div
                    key={index}
                    className="group relative bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => openLightbox(actualIndex)}
                  >
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Category Badge */}
                      {image.category && (
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/90 backdrop-blur-sm text-purple-700 text-[10px] sm:text-xs font-bold rounded-full shadow-sm">
                            {image.category}
                          </span>
                        </div>
                      )}

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <h3 className="text-white font-bold text-sm sm:text-lg mb-0.5 sm:mb-1 line-clamp-1">
                          {image.title || image.alt}
                        </h3>
                        {image.description && (
                          <p className="text-white/80 text-[10px] sm:text-xs line-clamp-2 hidden sm:block">{image.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
            />
          )
        }
      </div >
    </>
  );
}
