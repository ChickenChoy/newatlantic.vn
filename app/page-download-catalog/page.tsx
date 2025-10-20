import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function DownloadCatalogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              CHỌN CATALOG BẠN CẦN
            </h1>
            <p className="text-lg text-gray-600">
              Nhấn vào đường link để xem trước
            </p>
          </div>

        {/* Will-Burt Catalog Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] px-8 py-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white p-4 rounded-xl shadow-lg mr-6 transform hover:scale-105 transition-transform duration-200">
                    <Image
                      src="/images/partner/WillBurt.png"
                      alt="Will-Burt"
                      width={120}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">CATALOG WILL-BURT</h2>
                    <p className="text-blue-100 text-sm">Cột tự nâng chuyên nghiệp</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#5f7ab8]/30 transition-all duration-300 bg-gray-50/50 flex flex-col items-center text-center">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-[#5f7ab8] transition-colors">
                    Military elevation solution and tactical trailers
                  </h3>
                    <a 
                      href="https://drive.google.com/file/d/1v_Radki2cjTFfQjbZ2-od73xzmEqDY6O/view" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 font-medium"
                    >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    TẢI VỀ
                  </a>
                </div>

                <div className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#5f7ab8]/30 transition-all duration-300 bg-gray-50/50 flex flex-col items-center text-center">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-[#5f7ab8] transition-colors">
                    Telecommunication elevation solutions
                  </h3>
                    <a 
                      href="https://drive.google.com/file/d/1AQdNA8nPMgUg3_t5QLA1pdWoRDebq7Ho/view" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 font-medium"
                    >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    TẢI VỀ
                  </a>
                </div>

                <div className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#5f7ab8]/30 transition-all duration-300 bg-gray-50/50 flex flex-col items-center text-center">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-[#5f7ab8] transition-colors">
                    Military elevation solut. & tactical trailers 2
                  </h3>
                    <a 
                      href="https://drive.google.com/file/d/1v_Radki2cjTFfQjbZ2-od73xzmEqDY6O/view" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 font-medium"
                    >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    TẢI VỀ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hiab Catalog Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] px-8 py-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white p-4 rounded-xl shadow-lg mr-6 transform hover:scale-105 transition-transform duration-200">
                    <Image
                      src="/images/partner/hiab.png"
                      alt="Hiab"
                      width={120}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">CATALOG HIAB</h2>
                    <p className="text-blue-100 text-sm">Thiết bị nâng hạ chuyên nghiệp</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#5f7ab8]/30 transition-all duration-300 bg-gray-50/50 flex flex-col items-center text-center">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-[#5f7ab8] transition-colors">
                    All-electric Moffet E-Series nx
                  </h3>
                    <a 
                      href="https://drive.google.com/file/d/14Sa2lMixNqNVUUfrxO_3IDcQ9BqG9G4_/view" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 font-medium"
                    >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    TẢI VỀ
                  </a>
                </div>

                <div className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#5f7ab8]/30 transition-all duration-300 bg-gray-50/50 flex flex-col items-center text-center">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-[#5f7ab8] transition-colors">
                    Deliver More HIAB MOFFET
                  </h3>
                    <a 
                      href="https://drive.google.com/file/d/1meoPLNJcUQEtn4TKctweJLNR4Plzdt96/view" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 font-medium"
                    >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    TẢI VỀ
                  </a>
                </div>

                <div className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#5f7ab8]/30 transition-all duration-300 bg-gray-50/50 flex flex-col items-center text-center">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-[#5f7ab8] transition-colors">
                    The New MOFFET 4 <br /> NX
                  </h3>
                    <a 
                      href="https://drive.google.com/file/d/1IYD6hloU8_dalTgkSZXHuCNGjqJMrBXN/view" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 font-medium"
                    >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    TẢI VỀ
                  </a>
                </div>

                <div className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#5f7ab8]/30 transition-all duration-300 bg-gray-50/50 flex flex-col items-center text-center">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-[#5f7ab8] transition-colors">
                    Xe nâng gắn xe tải MOFFET
                  </h3>
                    <a 
                      href="https://publuu.com/flip-book/180051/1141767" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 font-medium"
                    >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    TẢI VỀ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}
