'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  interest: string;
}

interface FormErrors {
  [key: string]: string;
}

interface AnimatedContactFormProps {
  onSubmit?: (data: FormData) => Promise<void>;
}

const interestOptions = [
  { value: '', label: 'Chọn lĩnh vực quan tâm' },
  { value: 'will-burt', label: 'Cột tự nâng WILL-BURT' },
  { value: 'hiab', label: 'Cẩu tự hành HIAB' },
  { value: 'skymark', label: 'Thiết bị SKYMARK' },
  { value: 'other', label: 'Sản phẩm khác' },
];

export default function AnimatedContactForm({ onSubmit }: AnimatedContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    interest: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [focused, setFocused] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Vui lòng nhập họ và tên';
        if (value.trim().length < 2) return 'Tên phải có ít nhất 2 ký tự';
        if (!/^[À-ỹa-zA-Z\s]+$/.test(value)) return 'Tên không hợp lệ';
        return '';
      case 'email':
        if (!value.trim()) return 'Vui lòng nhập email';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Email không hợp lệ';
        return '';
      case 'phone':
        if (!value.trim()) return 'Vui lòng nhập số điện thoại';
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Số điện thoại không hợp lệ';
        return '';
      case 'message':
        if (!value.trim()) return 'Vui lòng nhập nội dung';
        if (value.trim().length < 10) return 'Nội dung phải có ít nhất 10 ký tự';
        if (value.trim().length > 1000) return 'Nội dung không được quá 1000 ký tự';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'message') {
      setCharacterCount(value.length);
    }

    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFocused(null);
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFocus = (name: string) => {
    setFocused(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'company' && key !== 'interest') {
        const error = validateField(key, formData[key as keyof FormData]);
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
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', company: '', message: '', interest: '' });
      setCharacterCount(0);
      setTouched({});
      setErrors({});

      // Reset success after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      setErrors({ submit: 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldStatus = (name: string) => {
    if (!touched[name]) return 'neutral';
    return errors[name] ? 'error' : 'success';
  };

  return (
    <div className="relative">
      {/* Success Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm rounded-3xl"
          >
            <div className="text-center p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Gửi thành công!</h3>
              <p className="text-gray-400 mb-6">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSuccess(false)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
              >
                Gửi yêu cầu khác
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Name Field */}
        <div className="relative">
          <motion.label
            htmlFor="name"
            animate={{
              y: focused === 'name' || formData.name ? -24 : 0,
              scale: focused === 'name' || formData.name ? 0.85 : 1,
              color: focused === 'name' ? '#22d3ee' : errors.name ? '#f87171' : '#9ca3af',
            }}
            className="absolute left-5 top-4 text-gray-400 pointer-events-none origin-left transition-colors"
          >
            Họ và tên <span className="text-red-400">*</span>
          </motion.label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={() => handleFocus('name')}
            className={`w-full px-5 py-4 bg-white/10 border rounded-xl focus:outline-none transition-all duration-300 text-white ${
              errors.name && touched.name
                ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                : 'border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
            }`}
          />
          <AnimatePresence>
            {errors.name && touched.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-400 text-sm mt-2 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.name}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Email & Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Field */}
          <div className="relative">
            <motion.label
              htmlFor="email"
              animate={{
                y: focused === 'email' || formData.email ? -24 : 0,
                scale: focused === 'email' || formData.email ? 0.85 : 1,
                color: focused === 'email' ? '#22d3ee' : errors.email ? '#f87171' : '#9ca3af',
              }}
              className="absolute left-5 top-4 text-gray-400 pointer-events-none origin-left transition-colors"
            >
              Email <span className="text-red-400">*</span>
            </motion.label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={() => handleFocus('email')}
              className={`w-full px-5 py-4 bg-white/10 border rounded-xl focus:outline-none transition-all duration-300 text-white ${
                errors.email && touched.email
                  ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                  : 'border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
              }`}
            />
            <AnimatePresence>
              {errors.email && touched.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm mt-2 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Phone Field */}
          <div className="relative">
            <motion.label
              htmlFor="phone"
              animate={{
                y: focused === 'phone' || formData.phone ? -24 : 0,
                scale: focused === 'phone' || formData.phone ? 0.85 : 1,
                color: focused === 'phone' ? '#22d3ee' : errors.phone ? '#f87171' : '#9ca3af',
              }}
              className="absolute left-5 top-4 text-gray-400 pointer-events-none origin-left transition-colors"
            >
              Số điện thoại <span className="text-red-400">*</span>
            </motion.label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={() => handleFocus('phone')}
              className={`w-full px-5 py-4 bg-white/10 border rounded-xl focus:outline-none transition-all duration-300 text-white ${
                errors.phone && touched.phone
                  ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                  : 'border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
              }`}
            />
            <AnimatePresence>
              {errors.phone && touched.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm mt-2 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.phone}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Company & Interest Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Field */}
          <div className="relative">
            <motion.label
              htmlFor="company"
              animate={{
                y: focused === 'company' || formData.company ? -24 : 0,
                scale: focused === 'company' || formData.company ? 0.85 : 1,
                color: focused === 'company' ? '#22d3ee' : '#9ca3af',
              }}
              className="absolute left-5 top-4 text-gray-400 pointer-events-none origin-left transition-colors"
            >
              Công ty (không bắt buộc)
            </motion.label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={() => handleFocus('company')}
              className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-white"
            />
          </div>

          {/* Interest Select */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-2">Lĩnh vực quan tâm</label>
            <select
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-white appearance-none cursor-pointer"
            >
              {interestOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-[42px] pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Message Field */}
        <div className="relative">
          <motion.label
            htmlFor="message"
            animate={{
              y: focused === 'message' || formData.message ? -24 : 0,
              scale: focused === 'message' || formData.message ? 0.85 : 1,
              color: focused === 'message' ? '#22d3ee' : errors.message ? '#f87171' : '#9ca3af',
            }}
            className="absolute left-5 top-4 text-gray-400 pointer-events-none origin-left transition-colors"
          >
            Nội dung <span className="text-red-400">*</span>
          </motion.label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={() => handleFocus('message')}
            className={`w-full px-5 py-4 bg-white/10 border rounded-xl focus:outline-none transition-all duration-300 text-white resize-none ${
              errors.message && touched.message
                ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                : 'border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
            }`}
          />
          <div className="flex justify-between items-center mt-2">
            <AnimatePresence>
              {errors.message && touched.message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.message}
                </motion.p>
              )}
            </AnimatePresence>
            <p className={`text-sm ml-auto ${characterCount > 900 ? 'text-yellow-400' : 'text-gray-500'}`}>
              {characterCount}/1000
            </p>
          </div>
        </div>

        {/* Submit Error */}
        <AnimatePresence>
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3"
            >
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Đang gửi...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Gửi yêu cầu
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
