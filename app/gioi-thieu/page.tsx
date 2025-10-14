import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Giới thiệu - NEW ATLANTIC',
  description: 'Giới thiệu về công ty Tân Đại Tây Dương - Nhà phân phối thiết bị công nghiệp hàng đầu Việt Nam',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Gradient */}
      <div className="relative bg-gradient-to-br from-[#5f7ab8] via-[#4a6199] to-gray-900 text-white pt-32 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
              WELCOME TO NEW ATLANTIC
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Tân Đại Tây Dương
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Nhà phân phối thiết bị công nghiệp hàng đầu Việt Nam
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">2003</div>
                <div className="text-sm text-white/80">Thành lập</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">Top 5</div>
                <div className="text-sm text-white/80">Doanh nghiệp Q.7</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">4</div>
                <div className="text-sm text-white/80">Thương hiệu lớn</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-white/80">Hỗ trợ khách hàng</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Company Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-4 py-1 bg-[#5f7ab8]/10 text-[#5f7ab8] rounded-full text-sm font-semibold mb-4">
                  VỀ CHÚNG TÔI
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Hành trình phát triển từ 2003
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  <strong>Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương</strong> được thành lập ngày 
                  14/05/2003, với nỗ lực không ngừng đã phát triển từ một doanh nghiệp nhỏ thành một công ty 
                  uy tín trong và ngoài nước.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Với doanh thu nhiều năm nằm trong <strong>top 5 doanh nghiệp lớn nhất tại Quận 7, TP. Hồ Chí Minh</strong>, 
                  chúng tôi tự hào là đối tác tin cậy của các thương hiệu hàng đầu thế giới.
                </p>
                <div className="flex gap-4">
                  <Link 
                    href="/san-pham"
                    className="bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300"
                  >
                    Xem sản phẩm
                  </Link>
                  <Link 
                    href="/lien-he"
                    className="border-2 border-[#5f7ab8] text-[#5f7ab8] px-8 py-3 rounded-lg font-semibold hover:bg-[#5f7ab8] hover:text-white transition-all duration-300"
                  >
                    Liên hệ ngay
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-[#5f7ab8]/20 to-[#4a6199]/20 rounded-3xl p-8">
                  <div className="bg-white rounded-2xl p-8 shadow-xl h-full flex flex-col justify-center">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#5f7ab8] rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Chất lượng đảm bảo</h4>
                          <p className="text-sm text-gray-600">Sản phẩm chính hãng 100%</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#5f7ab8] rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Giao hàng nhanh</h4>
                          <p className="text-sm text-gray-600">Toàn quốc trong 24-48h</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#5f7ab8] rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Hỗ trợ 24/7</h4>
                          <p className="text-sm text-gray-600">Luôn sẵn sàng phục vụ</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 bg-[#5f7ab8]/10 text-[#5f7ab8] rounded-full text-sm font-semibold mb-4">
              SẢN PHẨM & DỊCH VỤ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Các thương hiệu hàng đầu
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nhà phân phối chính thức của WILL-BURT, HIAB, LOVOL, LIUGONG tại Việt Nam
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Product Card 1 */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="relative z-10 text-white text-center p-6">
                  <div className="text-4xl font-bold mb-2">WILL-BURT</div>
                  <div className="text-sm opacity-90">USA</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-3">Cột Tự Nâng</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Cột tự nâng với hơn 100 năm lịch sử, chất lượng vượt trội cho quân sự, truyền thông và công nghiệp.
                </p>
                <Link href="/san-pham/cot-tu-nang-will-burt" className="text-[#5f7ab8] font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  Xem chi tiết
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-[#e74c3c] to-[#c0392b] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="relative z-10 text-white text-center p-6">
                  <div className="text-4xl font-bold mb-2">HIAB</div>
                  <div className="text-sm opacity-90">SWEDEN</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-3">Thiết Bị Nâng Hạ</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Cẩu tự hành, xe nâng Moffett đa dạng tải trọng, phù hợp mọi nhu cầu vận chuyển và xây dựng.
                </p>
                <Link href="/san-pham/thiet-bi-nang-ha-hiab" className="text-[#e74c3c] font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  Xem chi tiết
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-[#27ae60] to-[#229954] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="relative z-10 text-white text-center p-6">
                  <div className="text-4xl font-bold mb-2">LOVOL</div>
                  <div className="text-sm opacity-90">CHINA</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-3">TB Công Trình</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Máy móc công trình: máy xúc, máy ủi, máy san với giá cạnh tranh, hiệu suất cao.
                </p>
                <Link href="/san-pham/thiet-bi-cong-trinh-lovol" className="text-[#27ae60] font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  Xem chi tiết
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Product Card 4 */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-[#f39c12] to-[#d68910] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="relative z-10 text-white text-center p-6">
                  <div className="text-4xl font-bold mb-2">LIUGONG</div>
                  <div className="text-sm opacity-90">CHINA</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-3">TB Cơ Giới</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Thiết bị cơ giới xây dựng chất lượng cao, độ bền vượt trội cho mọi công trình.
                </p>
                <Link href="/san-pham/thiet-bi-cong-trinh-liugong" className="text-[#f39c12] font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  Xem chi tiết
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Service Highlight */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Dịch Vụ Nổi Bật</h3>
              <p className="text-lg mb-6 opacity-90">
                Thiết bị PCCC – Thiết bị Điện – Thiết bị chuyên dùng
              </p>
              <Link 
                href="/dich-vu"
                className="inline-block bg-white text-[#5f7ab8] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                Khám phá ngay →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global Network */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-1 bg-[#5f7ab8]/10 text-[#5f7ab8] rounded-full text-sm font-semibold mb-4">
                MẠNG LƯỚI TOÀN CẦU
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Đối tác quốc tế
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Hợp tác chặt chẽ với các đối tác chiến lược tại <strong>Bắc Mỹ, Châu Âu, Châu Á và Trung Đông</strong>, 
                cung cấp giải pháp tiên tiến đáp ứng nhu cầu đa dạng của khách hàng toàn cầu.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-[#5f7ab8]/10 transition-colors">
                <div className="text-4xl mb-3">🇺🇸</div>
                <div className="font-bold text-gray-900">Bắc Mỹ</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-[#5f7ab8]/10 transition-colors">
                <div className="text-4xl mb-3">🇪🇺</div>
                <div className="font-bold text-gray-900">Châu Âu</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-[#5f7ab8]/10 transition-colors">
                <div className="text-4xl mb-3">🌏</div>
                <div className="font-bold text-gray-900">Châu Á</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-[#5f7ab8]/10 transition-colors">
                <div className="text-4xl mb-3">🕌</div>
                <div className="font-bold text-gray-900">Trung Đông</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-1 bg-[#5f7ab8]/10 text-[#5f7ab8] rounded-full text-sm font-semibold mb-4">
                CHI NHÁNH TOÀN QUỐC
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Hệ thống văn phòng
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* HCM Office */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:border-[#5f7ab8] hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#5f7ab8] rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-xs text-[#5f7ab8] font-semibold mb-2">TRỤ SỞ CHÍNH</div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">TP. Hồ Chí Minh</h3>
                <p className="text-gray-600 text-sm mb-4">
                  A60 Phú Thuận, Phường Phú Thuận,<br/>
                  Quận 7, TP. Hồ Chí Minh
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <a href="tel:+842838733686" className="hover:text-[#5f7ab8] transition-colors">
                      +84 2838 733 686
                    </a>
                  </div>
                </div>
              </div>

              {/* Hanoi Office */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:border-[#5f7ab8] hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#5f7ab8] rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-xs text-[#5f7ab8] font-semibold mb-2">CHI NHÁNH MIỀN BẮC</div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Hà Nội</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Số 85 Nguyễn Phong Sắc,<br/>
                  Phường Dịch Vọng Hậu, Quận Cầu Giấy
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <a href="tel:+842838733686" className="hover:text-[#5f7ab8] transition-colors">
                      +84 2838 733 686
                    </a>
                  </div>
                </div>
              </div>

              {/* Quang Tri Office */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:border-[#5f7ab8] hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#5f7ab8] rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-xs text-[#5f7ab8] font-semibold mb-2">CHI NHÁNH MIỀN TRUNG</div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Quảng Trị</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Xã Triệu Giang,<br/>
                  Huyện Triệu Phong, Tỉnh Quảng Trị
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <a href="tel:+842838733686" className="hover:text-[#5f7ab8] transition-colors">
                      +84 2838 733 686
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
