'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trong thực tế, gửi data đến API
    console.log('Form submitted:', formData);
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
    setFormData({ name: '', email: '', phone: '', company: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 mt-6">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#5f7ab8] transition">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-[#5f7ab8] font-medium">Liên hệ</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] bg-clip-text text-transparent">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Contact Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Phone Card */}
            <a 
              href="tel:+842838733686"
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hotline</h3>
              <p className="text-[#5f7ab8] font-semibold text-lg">+84 2838 733 686</p>
              <p className="text-gray-500 text-sm mt-2">Hỗ trợ 24/7</p>
            </a>

            {/* Email Card */}
            <a 
              href="mailto:info@newatlantic.vn"
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-[#5f7ab8] font-semibold text-sm">info@newatlantic.vn</p>
              <p className="text-gray-500 text-sm mt-2">Phản hồi trong 24h</p>
            </a>

            {/* Working Hours Card */}
            <div className="bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-2xl p-6 shadow-lg text-white">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Giờ Làm Việc</h3>
              <p className="text-sm opacity-90">T2-T6: 8:00 - 17:30</p>
              <p className="text-sm opacity-90">T7: 8:00 - 12:00</p>
            </div>
          </div>

          {/* Form and Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form - 2 columns on large screens */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Gửi Yêu Cầu Tư Vấn</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2 text-sm">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent transition-all"
                        placeholder="Nhập họ và tên"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2 text-sm">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent transition-all"
                        placeholder="0912345678"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2 text-sm">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent transition-all"
                        placeholder="example@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-gray-700 font-medium mb-2 text-sm">
                        Công ty
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent transition-all"
                        placeholder="Tên công ty"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2 text-sm">
                      Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent transition-all resize-none"
                      placeholder="Nhập nội dung cần tư vấn..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                  >
                    Gửi yêu cầu tư vấn
                  </button>
                </form>
              </div>
            </div>

            {/* Right Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Why Choose Us */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Tại sao chọn chúng tôi?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#5f7ab8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Đại lý chính thức</p>
                      <p className="text-xs text-gray-600 mt-0.5">WILL-BURT, HIAB, LOVOL, LIUGONG</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#5f7ab8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Bảo hành chính hãng</p>
                      <p className="text-xs text-gray-600 mt-0.5">Chế độ bảo hành toàn diện</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#5f7ab8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Hỗ trợ 24/7</p>
                      <p className="text-xs text-gray-600 mt-0.5">Đội ngũ kỹ thuật chuyên nghiệp</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#5f7ab8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Tư vấn miễn phí</p>
                      <p className="text-xs text-gray-600 mt-0.5">Giải pháp tối ưu cho dự án</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Liên Hệ Nhanh</h3>
                <div className="space-y-3">
                  <a
                    href="tel:+842838733686"
                    className="block w-full bg-white text-[#5f7ab8] text-center py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
                  >
                    📞 Gọi ngay
                  </a>
                  <a
                    href="mailto:info@newatlantic.vn"
                    className="block w-full bg-white/20 backdrop-blur-sm text-white text-center py-3 rounded-xl font-bold hover:bg-white/30 transition-all"
                  >
                    ✉️ Gửi email
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Office Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* HCM Office */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
              <div className="p-6 flex-shrink-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#5f7ab8]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Trụ Sở Chính - TP.HCM</h3>
                </div>
                <div className="space-y-2 text-sm min-h-[120px]">
                  <p className="text-gray-700">
                    <span className="font-semibold">Địa chỉ:</span> A60 Đường Phú Thuận, Phường Phú Thuận, Quận 7, TP.HCM
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Điện thoại:</span>{' '}
                    <a href="tel:+842838733686" className="text-[#5f7ab8] hover:underline">
                      +84 2838 733 686
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span>{' '}
                    <a href="mailto:info@newatlantic.vn" className="text-[#5f7ab8] hover:underline">
                      info@newatlantic.vn
                    </a>
                  </p>
                </div>
              </div>
              
              {/* Google Maps */}
              <div className="flex-1 border-t border-gray-200 min-h-[280px]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4752.029135340127!2d106.73285127578363!3d10.731304260022924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175253f08df6c91%3A0x3692111b5c643ce2!2sNewatlantic%20International%20JSC!5e1!3m2!1svi!2s!4v1760503596543!5m2!1svi!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Hanoi Office */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
              <div className="p-6 flex-shrink-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#5f7ab8]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Văn Phòng Hà Nội</h3>
                </div>
                <div className="space-y-2 text-sm min-h-[120px]">
                  <p className="text-gray-700">
                    <span className="font-semibold">Địa chỉ:</span> Số 85 Đường Nguyễn Phong Sắc, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Điện thoại:</span>{' '}
                    <a href="tel:+842838733686" className="text-[#5f7ab8] hover:underline">
                      +84 2838 733 686
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span>{' '}
                    <a href="mailto:info@newatlantic.vn" className="text-[#5f7ab8] hover:underline">
                      info@newatlantic.vn
                    </a>
                  </p>
                </div>
              </div>
              
              {/* Google Maps */}
              <div className="flex-1 border-t border-gray-200 min-h-[280px]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4514.198692704718!2d105.7877081759183!3d21.038676487436643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab365050f60f%3A0x973143159aecba74!2zU-G7kSA4NSDEkC4gTmd1eeG7hW4gUGhvbmcgU-G6r2MsIEThu4tjaCBW4buNbmcgSOG6rXUsIEPhuqd1IEdp4bqleSwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e1!3m2!1svi!2s!4v1760503649400!5m2!1svi!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
