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
    <div className="bg-gray-50 min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-[#e5e7eb] mt-6">
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

      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] bg-clip-text text-transparent">
            Liên Hệ
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-[#5f7ab8]"></div>
            <div className="w-2 h-2 bg-[#5f7ab8] rounded-full"></div>
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-[#5f7ab8]"></div>
          </div>
          <p className="text-gray-600 text-lg">Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
            <h2 className="text-3xl font-bold mb-8">Gửi Yêu Cầu Tư Vấn</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f7ab8] transition-all"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f7ab8] transition-all"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f7ab8] transition-all"
                  placeholder="0912345678"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-gray-700 font-medium mb-2">
                  Công ty
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f7ab8] transition-all"
                  placeholder="Tên công ty"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f7ab8] transition-all"
                  placeholder="Nhập nội dung cần tư vấn..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white py-3 rounded-xl text-sm font-bold hover:shadow-xl hover:scale-105 transition-all"
              >
                Gửi yêu cầu
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Office Info */}
            <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
              <h2 className="text-3xl font-bold mb-8">Thông Tin Liên Hệ</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#5f7ab8]">🏢 Trụ Sở Chính - TP.HCM</h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Địa chỉ:</strong> A60 Đường Phú Thuận, Phường Phú Thuận, Quận 7, TP.HCM
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Điện thoại:</strong>{' '}
                    <a href="tel:+842838733686" className="text-[#5f7ab8] hover:underline">
                      +84 2838 733 686
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:info@newatlantic.vn" className="text-[#5f7ab8] hover:underline">
                      info@newatlantic.vn
                    </a>
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold mb-3 text-[#5f7ab8]">🏢 Văn Phòng Hà Nội</h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Địa chỉ:</strong> Số 85 Đường Nguyễn Phong Sắc, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Điện thoại:</strong>{' '}
                    <a href="tel:+842838733686" className="text-[#5f7ab8] hover:underline">
                      +84 2838 733 686
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:info@newatlantic.vn" className="text-[#5f7ab8] hover:underline">
                      info@newatlantic.vn
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] text-white rounded-3xl shadow-xl p-10 relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute w-64 h-64 bg-white/5 rounded-full blur-3xl top-0 right-0"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">⏰ Giờ Làm Việc</h3>
              <div className="space-y-2 relative z-10">
                <p><strong>Thứ 2 - Thứ 6:</strong> 8:00 - 17:30</p>
                <p><strong>Thứ 7:</strong> 8:00 - 12:00</p>
                <p><strong>Chủ nhật:</strong> Nghỉ</p>
                <p className="mt-4 text-gray-200">
                  * Hỗ trợ khẩn cấp 24/7 qua hotline
                </p>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
              <h3 className="text-3xl font-bold mb-6">Liên Hệ Nhanh</h3>
              <div className="space-y-4">
                <a
                  href="tel:+842838733686"
                  className="block w-full bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white text-center py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
                >
                  📞 Gọi ngay: +84 2838 733 686
                </a>
                <a
                  href="mailto:info@newatlantic.vn"
                  className="block w-full bg-gray-100 text-gray-900 text-center py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  📧 Email: info@newatlantic.vn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

