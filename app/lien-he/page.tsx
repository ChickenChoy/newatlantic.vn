'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateBreadcrumbSchema, generateLocalBusinessSchema } from '@/lib/seo';
import { validateVietnamesePhone } from '@/lib/validation';
import { OfficeLocation } from '@/types';

export default function ContactPage() {
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([]);
  const [isLoadingOffices, setIsLoadingOffices] = useState(true);

  // Load office locations from API
  const loadOfficeLocations = useCallback(async () => {
    try {
      setIsLoadingOffices(true);
      const res = await fetch('/api/office-locations');
      if (res.ok) {
        const data = await res.json();
        setOfficeLocations(data.sort((a: OfficeLocation, b: OfficeLocation) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error loading office locations:', error);
    } finally {
      setIsLoadingOffices(false);
    }
  }, []);

  // Update page title and load data
  useEffect(() => {
    document.title = 'Liên hệ | NEW ATLANTIC - Tân Đại Tây Dương';
    loadOfficeLocations();
  }, [loadOfficeLocations]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Vui lòng nhập họ và tên';
        if (value.trim().length < 2) return 'Tên phải có ít nhất 2 ký tự';
        return '';
      case 'email':
        if (!value.trim()) return 'Vui lòng nhập email';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Email không hợp lệ';
        return '';
      case 'phone':
        if (!value.trim()) return 'Vui lòng nhập số điện thoại';
        const phoneValidation = validateVietnamesePhone(value);
        if (!phoneValidation.valid) return phoneValidation.error || 'Số điện thoại không hợp lệ';
        return '';
      case 'message':
        if (!value.trim()) return 'Vui lòng nhập nội dung';
        if (value.trim().length < 10) return 'Nội dung phải có ít nhất 10 ký tự';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name] && touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'company') {
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', formData);

      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      setErrors({});
      setTouched({});

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Hide success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: '/' },
    { name: 'Liên hệ', url: '/lien-he' },
  ]);

  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <div className="bg-[#050c3a] min-h-screen pt-24 sm:pt-28 md:pt-32 relative overflow-hidden">
        {/* Background decorative elements - Subtle cyan/teal accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>



        {/* Header Section */}
        <div className="relative z-10 border-b border-white/10">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                Kết nối với chúng tôi
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                Liên Hệ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Tư Vấn</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
                Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn. Hãy để lại thông tin, đội ngũ chuyên gia sẽ liên hệ ngay.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">

          {/* Contact Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Phone Card */}
            <a
              href="tel:+842838733686"
              className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1 border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Hotline</h3>
              <p className="text-cyan-400 font-bold text-lg relative z-10">+84 2838 733 686</p>
              <p className="text-gray-400 text-sm mt-2 relative z-10">Hỗ trợ 24/7</p>
            </a>

            {/* Email Card */}
            <a
              href="mailto:info@newatlantic.vn"
              className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1 border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Email</h3>
              <p className="text-teal-400 font-bold text-lg relative z-10">info@newatlantic.vn</p>
              <p className="text-gray-400 text-sm mt-2 relative z-10">Phản hồi trong 24h</p>
            </a>

            {/* Working Hours Card */}
            <div className="group bg-gradient-to-br from-cyan-600 to-teal-600 rounded-3xl p-8 shadow-xl shadow-cyan-600/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10">Giờ Làm Việc</h3>
              <div className="space-y-1 relative z-10">
                <p className="text-cyan-50 font-medium">T2 - T6: 8:00 - 17:30</p>
                <p className="text-cyan-50 font-medium">Thứ 7: 8:00 - 12:00</p>
              </div>
            </div>
          </div>

          {/* Form and Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form - 2 columns on large screens */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10">
                <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-500 to-teal-600 rounded-full"></span>
                  Gửi Yêu Cầu Tư Vấn
                </h2>

                {/* Success Message */}
                {isSuccess && (
                  <div className="mb-8 p-6 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-start gap-4 animate-fade-in">
                    <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-green-400 font-bold text-lg mb-1">Gửi thành công!</h4>
                      <p className="text-green-300">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {errors.submit && (
                  <div className="mb-8 p-6 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-start gap-4 animate-fade-in">
                    <div className="w-10 h-10 bg-red-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-red-400 font-bold text-lg mb-1">Có lỗi xảy ra</h4>
                      <p className="text-red-300">{errors.submit}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-gray-300 font-semibold text-sm">
                        Họ và tên <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-5 py-3.5 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white/15 transition-all duration-300 text-white placeholder-gray-400 ${errors.name && touched.name
                          ? 'border-red-400/50 focus:ring-red-400/30'
                          : 'border-white/20 focus:ring-cyan-400/30 focus:border-cyan-400'
                          }`}
                        placeholder="Nhập họ và tên"
                      />
                      {errors.name && touched.name && (
                        <p className="text-sm text-red-400 flex items-center gap-1 animate-fade-in">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-gray-300 font-semibold text-sm">
                        Số điện thoại <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-5 py-3.5 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white/15 transition-all duration-300 text-white placeholder-gray-400 ${errors.phone && touched.phone
                          ? 'border-red-400/50 focus:ring-red-400/30'
                          : 'border-white/20 focus:ring-cyan-400/30 focus:border-cyan-400'
                          }`}
                        placeholder="0912 345 678"
                      />
                      {errors.phone && touched.phone && (
                        <p className="text-sm text-red-400 flex items-center gap-1 animate-fade-in">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-gray-300 font-semibold text-sm">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-5 py-3.5 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white/15 transition-all duration-300 text-white placeholder-gray-400 ${errors.email && touched.email
                          ? 'border-red-400/50 focus:ring-red-400/30'
                          : 'border-white/20 focus:ring-cyan-400/30 focus:border-cyan-400'
                          }`}
                        placeholder="example@email.com"
                      />
                      {errors.email && touched.email && (
                        <p className="text-sm text-red-400 flex items-center gap-1 animate-fade-in">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="company" className="block text-gray-300 font-semibold text-sm">
                        Công ty
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 focus:bg-white/15 transition-all duration-300 text-white placeholder-gray-400"
                        placeholder="Tên công ty"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-gray-300 font-semibold text-sm">
                      Nội dung <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={5}
                      className={`w-full px-5 py-3.5 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white/15 transition-all duration-300 resize-none text-white placeholder-gray-400 ${errors.message && touched.message
                        ? 'border-red-400/50 focus:ring-red-400/30'
                        : 'border-white/20 focus:ring-cyan-400/30 focus:border-cyan-400'
                        }`}
                      placeholder="Nhập nội dung cần tư vấn..."
                    />
                    {errors.message && touched.message && (
                      <p className="text-sm text-red-400 flex items-center gap-1 animate-fade-in">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center gap-3 ${isSubmitting
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-1'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <span>Gửi yêu cầu tư vấn</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Sidebar - 1 column */}
            <div className="space-y-8">
              {/* Why Choose Us */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <h3 className="text-xl font-bold mb-6 text-white">Tại sao chọn chúng tôi?</h3>
                <div className="space-y-6">
                  {[
                    { title: 'Đại lý chính thức', desc: 'WILL-BURT, HIAB, SKYMARK', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { title: 'Bảo hành chính hãng', desc: 'Chế độ bảo hành toàn diện', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
                    { title: 'Hỗ trợ 24/7', desc: 'Đội ngũ kỹ thuật chuyên nghiệp', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { title: 'Tư vấn miễn phí', desc: 'Giải pháp tối ưu cho dự án', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 text-cyan-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-white">{item.title}</p>
                        <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-cyan-600 to-teal-600 rounded-3xl shadow-xl shadow-cyan-600/20 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <h3 className="text-xl font-bold mb-6 relative z-10">Liên Hệ Nhanh</h3>
                <div className="space-y-4 relative z-10">
                  <a
                    href="tel:+842838733686"
                    className="block w-full bg-white text-cyan-700 text-center py-4 rounded-xl font-bold hover:bg-cyan-50 hover:shadow-lg transition-all transform hover:-translate-y-1"
                  >
                    Gọi ngay
                  </a>
                  <a
                    href="mailto:info@newatlantic.vn"
                    className="block w-full bg-white/20 backdrop-blur-sm text-white text-center py-4 rounded-xl font-bold hover:bg-white/30 hover:shadow-lg transition-all transform hover:-translate-y-1 border border-white/30"
                  >
                    Gửi email
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Office Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {isLoadingOffices ? (
              <>
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 animate-pulse h-[500px]"></div>
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 animate-pulse h-[500px]"></div>
              </>
            ) : officeLocations.length > 0 ? (
              officeLocations.map((office) => (
                <div key={office.id} className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 flex flex-col group hover:bg-white/15 transition-all duration-300">
                  <div className="p-8 flex-shrink-0">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white">{office.name}</h3>
                    </div>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-300 leading-relaxed">{office.address}</p>
                      </div>
                      {office.phone && (
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${office.phone}`} className="text-gray-300 hover:text-cyan-400 font-medium transition-colors">
                            {office.phone}
                          </a>
                        </div>
                      )}
                      {office.email && (
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href={`mailto:${office.email}`} className="text-gray-300 hover:text-cyan-400 font-medium transition-colors">
                            {office.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Google Maps */}
                  {office.googleMapsUrl && (
                    <div className="flex-1 border-t border-white/10 min-h-[300px] relative">
                      <iframe
                        src={office.googleMapsUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="grayscale hover:grayscale-0 transition-all duration-500"
                      ></iframe>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-gray-400">
                Chưa có thông tin văn phòng
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
