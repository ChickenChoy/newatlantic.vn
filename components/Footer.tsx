import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
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
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Nhà phân phối hàng đầu các thương hiệu thiết bị công nghiệp: WILL-BURT, HIAB, LOVOL, LIUGONG tại Việt Nam
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/aittandaitayduong" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-[#14b8a6] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-lg"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Liên kết nhanh</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#5f7ab8] transition-all duration-300 hover:translate-x-1 inline-block">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="text-gray-400 hover:text-[#5f7ab8] transition-all duration-300 hover:translate-x-1 inline-block">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/san-pham/cot-tu-nang-will-burt" className="text-gray-400 hover:text-[#5f7ab8] transition-colors">
                  Cột Tự Nâng WILL-BURT
                </Link>
              </li>
              <li>
                <Link href="/san-pham/thiet-bi-nang-ha-hiab" className="text-gray-400 hover:text-[#5f7ab8] transition-colors">
                  Thiết Bị HIAB
                </Link>
              </li>
              <li>
                <Link href="/san-pham/thiet-bi-cong-trinh-lovol" className="text-gray-400 hover:text-[#5f7ab8] transition-colors">
                  Thiết Bị LOVOL
                </Link>
              </li>
              <li>
                <Link href="/san-pham/thiet-bi-cong-trinh-liugong" className="text-gray-400 hover:text-[#5f7ab8] transition-colors">
                  Thiết Bị LIUGONG
                </Link>
              </li>
              <li>
                <Link href="/tin-tuc" className="text-gray-400 hover:text-[#5f7ab8] transition-colors">
                  Tin tức
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Dịch vụ</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/page-download-catalog" className="text-gray-400 hover:text-[#5f7ab8] transition-colors">
                  Catalog sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/thu-vien-hinh-anh" className="text-gray-400 hover:text-[#5f7ab8] transition-colors">
                  Thư viện hình ảnh
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="text-gray-400 hover:text-[#5f7ab8] transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Liên hệ</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#5f7ab8] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-semibold text-white mb-1">TP.HCM (Trụ sở chính)</div>
                  <p className="text-gray-400">A60 Đường Phú Thuận, P. Phú Thuận, Q.7</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#5f7ab8] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-semibold text-white mb-1">Hà Nội</div>
                  <p className="text-gray-400">85 Nguyễn Phong Sắc, Cầu Giấy</p>
                </div>
              </div>
              <div className="pt-2 space-y-2">
                <a href="tel:+842838733686" className="flex items-center gap-3 text-gray-300 hover:text-[#5f7ab8] transition-colors">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  +84 2838 733 686
                </a>
                <a href="mailto:info@newatlantic.vn" className="flex items-center gap-3 text-gray-300 hover:text-[#5f7ab8] transition-colors">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-gray-400">
              &copy; 2025 <span className="text-white font-semibold">newatlantic.vn</span> - Bản quyền thuộc về Công ty CP TM QT Tân Đại Tây Dương
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm justify-center">
              <Link href="/chinh-sach-bao-mat" className="text-gray-400 hover:text-[#5f7ab8] transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/dieu-khoan-dich-vu" className="text-gray-400 hover:text-[#5f7ab8] transition-colors">
                Điều khoản dịch vụ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
