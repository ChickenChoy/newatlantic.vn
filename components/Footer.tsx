import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_2fr] gap-6 md:gap-8 lg:gap-10">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo/logo.png"
                  alt="NEW ATLANTIC"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-lg font-bold text-white">NEW ATLANTIC</div>
                <div className="text-xs text-gray-400">Tân Đại Tây Dương</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Nhà phân phối hàng đầu các thương hiệu thiết bị công nghiệp: WILL-BURT, HIAB, LOVOL, LIUGONG
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-[#14b8a6] rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-[#f97316] rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-[#a855f7] rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Sản phẩm</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/san-pham/cot-tu-nang-will-burt" className="text-sm hover:text-[#14b8a6] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#14b8a6] rounded-full"></span>
                  Cột Tự Nâng WILL-BURT
                </Link>
              </li>
              <li>
                <Link href="/san-pham/thiet-bi-nang-ha-hiab" className="text-sm hover:text-[#f97316] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full"></span>
                  Thiết Bị Nâng Hạ HIAB
                </Link>
              </li>
              <li>
                <Link href="/san-pham/thiet-bi-cong-trinh-lovol" className="text-sm hover:text-[#10b981] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></span>
                  Thiết Bị Công Trình LOVOL
                </Link>
              </li>
              <li>
                <Link href="/san-pham/thiet-bi-cong-trinh-liugong" className="text-sm hover:text-[#3b82f6] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full"></span>
                  Thiết Bị Công Trình LIUGONG
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:ml-auto lg:mr-22">
            <h4 className="text-white font-bold mb-4 text-lg">Liên kết</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm hover:text-[#5f7ab8] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#5f7ab8] rounded-full"></span>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="text-sm hover:text-[#5f7ab8] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#5f7ab8] rounded-full"></span>
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/tin-tuc" className="text-sm hover:text-[#5f7ab8] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#5f7ab8] rounded-full"></span>
                  Tin tức
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="text-sm hover:text-[#5f7ab8] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#5f7ab8] rounded-full"></span>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Liên hệ</h4>
            <div className="space-y-3 text-sm">
              <div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#5f7ab8] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white mb-0.5">TP.HCM</div>
                    <p className="text-gray-400">A60 Đường Phú Thuận, Q.7</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#5f7ab8] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white mb-0.5">Hà Nội</div>
                    <p className="text-gray-400">85 Nguyễn Phong Sắc, Cầu Giấy</p>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-700 space-y-1.5">
                <a href="tel:+842838733686" className="flex items-center gap-2 text-gray-300 hover:text-[#5f7ab8] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  +84 2838 733 686
                </a>
                <a href="mailto:info@newatlantic.vn" className="flex items-center gap-2 text-gray-300 hover:text-[#5f7ab8] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  info@newatlantic.vn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              &copy; 2025 <span className="text-white font-semibold">newatlantic.vn</span> - Bản quyền thuộc về Công ty CP TM QT Tân Đại Tây Dương
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/chinh-sach-bao-mat" className="text-gray-400 hover:text-[#5f7ab8] transition-colors">Chính sách bảo mật</Link>
              <Link href="/dieu-khoan-dich-vu" className="text-gray-400 hover:text-[#5f7ab8] transition-colors">Điều khoản dịch vụ</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
