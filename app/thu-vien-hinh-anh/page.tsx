'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { generateBreadcrumbSchema } from '@/lib/seo';

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Gallery images
  const galleryImages = [
    { src: '/images/resources/1.png', alt: 'Hình ảnh  1' },
    { src: '/images/resources/2.png', alt: 'Hình ảnh  2' },
    { src: '/images/resources/3.png', alt: 'Hình ảnh  3' },
    { src: '/images/resources/4.png', alt: 'Hình ảnh  4' },
    { src: '/images/resources/5.png', alt: 'Hình ảnh  5' },
    { src: '/images/resources/6.png', alt: 'Hình ảnh  6' },
    { src: '/images/resources/7.png', alt: 'Hình ảnh  7' },
    { src: '/images/resources/8.png', alt: 'Hình ảnh  8' },
    { src: '/images/resources/9.png', alt: 'Hình ảnh  9' },
    { src: '/images/resources/10.png', alt: 'Hình ảnh  10' },
    { src: '/images/resources/AIT.jpg', alt: 'Hình ảnh AIT' },
  ];

  // Update page title
  useEffect(() => {
    document.title = 'Thư viện hình ảnh | NEW ATLANTIC - Tân Đại Tây Dương';
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, galleryImages.length]);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: '/' },
    { name: 'Thư viện hình ảnh', url: '/thu-vien-hinh-anh' },
  ]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
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

      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen pt-16">
        {/* Breadcrumb */}
        <div className="bg-gray-50 mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#5f7ab8] transition">
                Trang chủ
              </Link>
              <span>/</span>
              <span className="text-[#5f7ab8] font-medium">Thư viện hình ảnh</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Thư Viện Hình Ảnh
            </h1>
            <p className="text-sm text-gray-600">
              Khám phá bộ sưu tập hình ảnh thiết bị và  của chúng tôi
            </p>
          </div>

          {/* Image Slider */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Main Slider */}
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
                  {galleryImages.map((image, index) => (
                    <div
                      key={index}
                      className="min-w-full h-full relative cursor-pointer"
                      onClick={() => setSelectedImage(image.src)}
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
                  ))}
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
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

                {/* Slide Counter */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentSlide + 1} / {galleryImages.length}
                </div>

                {/* Image Title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-white text-lg font-semibold">
                    {galleryImages[currentSlide].alt}
                  </h3>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="bg-gray-50 p-4">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {galleryImages.map((image, index) => (
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

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 py-4 bg-white">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      currentSlide === index
                        ? 'bg-[#5f7ab8] w-8 h-2'
                        : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Lightbox Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fadeIn"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                onClick={() => setSelectedImage(null)}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                <Image
                  src={selectedImage}
                  alt="Full size image"
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


