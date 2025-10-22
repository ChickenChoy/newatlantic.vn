'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TouchGestureWrapper from './TouchGestureWrapper';

interface ProductPageContentProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductPageContent({ product, relatedProducts }: ProductPageContentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const images = product.images || [product.image];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Navigation functions for related products slider
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -272, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 272, behavior: 'smooth' });
    }
  };

  // Auto-scroll for related products slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || relatedProducts.length <= 3) return;

    let scrollInterval: NodeJS.Timeout;
    let isUserInteracting = false;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!isUserInteracting && slider) {
          const maxScroll = slider.scrollWidth - slider.clientWidth;
          const currentScroll = slider.scrollLeft;
          
          if (currentScroll >= maxScroll - 10) {
            // Reset to start
            slider.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Scroll by card width (w-64 = 256px + gap 16px)
            slider.scrollBy({ left: 272, behavior: 'smooth' });
          }
        }
      }, 3000); // Auto-scroll every 3 seconds
    };

    const handleUserInteraction = () => {
      isUserInteracting = true;
      clearInterval(scrollInterval);
      
      // Resume auto-scroll after 5 seconds of no interaction
      setTimeout(() => {
        isUserInteracting = false;
        startAutoScroll();
      }, 5000);
    };

    slider.addEventListener('mouseenter', handleUserInteraction);
    slider.addEventListener('touchstart', handleUserInteraction);

    startAutoScroll();

    return () => {
      clearInterval(scrollInterval);
      if (slider) {
        slider.removeEventListener('mouseenter', handleUserInteraction);
        slider.removeEventListener('touchstart', handleUserInteraction);
      }
    };
  }, [relatedProducts.length]);

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-gray-100 mt-4">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#5f7ab8] transition">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/san-pham" className="hover:text-[#5f7ab8] transition">
              Sản phẩm
            </Link>
            <span>/</span>
            <Link 
              href={`/san-pham/${product.categorySlug}`} 
              className="hover:text-[#5f7ab8] transition"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[#5f7ab8] font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-gray-50 rounded-3xl shadow-xl p-8 lg:p-12 mb-16">
          {/* Product Image Slider */}
          <div>
            <TouchGestureWrapper
              onSwipeLeft={nextImage}
              onSwipeRight={prevImage}
              className="relative h-[600px] bg-gray-200 rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Main Image */}
              <div className="relative w-full h-full">
                {images[currentImageIndex] ? (
                  <Image
                    src={images[currentImageIndex]}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    quality={95}
                    priority={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-40 h-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Navigation Arrows - Only show if there are multiple images */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-5 py-2 rounded-full text-sm font-bold shadow-xl">
                    ⭐ Sản phẩm nổi bật
                  </div>
                )}

                {/* Image Counter - Only show if there are multiple images */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation - Only show if there are multiple images */}
              {images.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex gap-2 justify-center">
                    {images.map((image: string, index: number) => (
                      <button 
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-16 h-16 bg-white rounded-lg overflow-hidden border-2 shadow-lg transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'border-[#5f7ab8]' 
                            : 'border-transparent hover:border-[#5f7ab8]'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - Ảnh ${index + 1}`}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </TouchGestureWrapper>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            {/* Header Section */}
            <div className="mb-4">
              {/* Category Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded-full mb-3">
                <svg className="w-3 h-3 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-xs font-semibold text-[#5f7ab8] uppercase tracking-wide">{product.category}</span>
              </div>

              {/* Product Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Description with accent */}
              <div className="relative pl-4 border-l-4 border-[#5f7ab8]">
                <p className="text-base text-gray-900 leading-relaxed font-medium">
                  "{product.description}"
                </p>
              </div>
            </div>

            {/* Price Card - Premium Design */}
            <div className="mb-4">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5f7ab8] via-[#4a6199] to-[#3d4f7a] p-4 shadow-xl transform hover:scale-[1.02] transition-all duration-300">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/10 rounded-full -ml-10 -mb-10"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">Giá sản phẩm</span>
                    <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{product.price}</div>
                  <p className="text-white/80 text-xs">Liên hệ ngay để nhận báo giá tốt nhất</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mb-4">
              <a href="tel:+842838733686" className="group w-full bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] hover:from-[#4a6199] hover:to-[#3d4f7a] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-lg hover:shadow-xl relative overflow-hidden block">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex flex-col items-center justify-center space-y-1">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm">Liên hệ tư vấn miễn phí</span>
                  </div>
                  <span className="text-lg font-black tracking-wider">+84 2838 733 686</span>
                </div>
              </a>
            </div>

            {/* Premium Features */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                <svg className="w-4 h-4 text-[#5f7ab8] mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Cam kết chất lượng
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold text-sm">Chất lượng cao, độ bền vượt trội</p>
                    <p className="text-xs text-gray-600 mt-0.5">Đạt tiêu chuẩn quốc tế ISO 9001</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold text-sm">Bảo hành chính hãng</p>
                    <p className="text-xs text-gray-600 mt-0.5">Chế độ bảo hành toàn diện từ nhà sản xuất</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold text-sm">Hỗ trợ kỹ thuật 24/7</p>
                    <p className="text-xs text-gray-600 mt-0.5">Đội ngũ kỹ sư chuyên nghiệp sẵn sàng hỗ trợ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-gray-50 rounded-3xl shadow-xl p-8 lg:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Thông tin chi tiết</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Specifications */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-[#5f7ab8] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Thông số kỹ thuật
              </h3>
              <div className="bg-gray-100 rounded-xl p-6 space-y-3">
                {Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-gray-200 last:border-0">
                    <span className="text-gray-900 font-semibold">{key}:</span>
                    <span className="font-bold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-[#5f7ab8] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mô tả sản phẩm
              </h3>
              <div className="bg-gray-100 rounded-xl p-6">
                <p className="text-gray-900 leading-relaxed text-base font-medium">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Slider */}
        {relatedProducts.length > 0 && (
          <div className="bg-gray-50 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sản phẩm liên quan</h2>
            
            {/* Slider Container */}
            <TouchGestureWrapper
              onSwipeLeft={scrollRight}
              onSwipeRight={scrollLeft}
              className="relative group"
            >
                {/* Navigation Arrows */}
                {relatedProducts.length > 3 && (
                  <>
                    <button
                      onClick={scrollLeft}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                      aria-label="Scroll left"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={scrollRight}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                      aria-label="Scroll right"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Slider Track */}
                <div ref={sliderRef} className="overflow-x-auto scrollbar-hide">
                  <div className="flex gap-4 pb-4">
                  {relatedProducts.map((relatedProduct) => (
                    <Link 
                      key={relatedProduct.id} 
                      href={`/san-pham/${relatedProduct.categorySlug}/${relatedProduct.slug}`}
                      className="group flex-shrink-0 w-64 bg-gray-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl overflow-hidden">
                        {relatedProduct.image ? (
                          <>
                            <Image
                              src={relatedProduct.image}
                              alt={relatedProduct.name}
                              fill
                              className="object-contain p-2 group-hover:scale-110 transition-transform duration-700"
                              quality={85}
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Featured Badge */}
                        {relatedProduct.featured && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-2 py-1 rounded-full text-xs font-bold">
                            ⭐ Nổi bật
                          </div>
                        )}
                        
                        {/* Price Badge */}
                        <div className="absolute bottom-2 left-2 right-2 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-3 py-1.5 rounded-full text-xs font-bold text-center">
                          {relatedProduct.price}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-[#5f7ab8] transition-colors line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {relatedProduct.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                  </div>
                </div>

                {/* Scroll Indicator */}
                <div className="flex justify-center mt-4 gap-2">
                  <div className="text-xs text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Vuốt sang để xem thêm
                  </div>
                </div>
            </TouchGestureWrapper>
          </div>
        )}
      </div>
    </div>
  );
}
