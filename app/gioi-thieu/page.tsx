import Link from 'next/link';

export const metadata = {
  title: 'Giới thiệu - NEW ATLANTIC',
  description: 'Giới thiệu về công ty Tân Đại Tây Dương - Nhà phân phối thiết bị công nghiệp hàng đầu Việt Nam',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-[#e5e7eb] mt-4 mb-4">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#5f7ab8] transition">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-[#5f7ab8] font-medium">Giới thiệu</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section - Compact */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            VỀ <span className="text-[#5f7ab8]">NEW ATLANTIC</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nhà phân phối thiết bị công nghiệp hàng đầu tại Việt Nam
          </p>
        </div>

        {/* Main Info Card */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 mb-8 border border-gray-200">
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Công ty Cổ Phần Thương Mại Quốc Tế Tân Đại Tây Dương (NEW ATLANTIC)</strong> là đối tác chính thức 
            của các thương hiệu <strong>WILL-BURT, HIAB, LOVOL, LIUGONG</strong> tại Việt Nam.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Với nhiều năm kinh nghiệm, chúng tôi cam kết mang đến sản phẩm chất lượng cao 
            và dịch vụ hậu mãi tận tâm cho khách hàng.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-2xl font-bold text-[#5f7ab8] mb-1">15+</div>
            <div className="text-xs text-gray-600">Năm kinh nghiệm</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-2xl font-bold text-[#5f7ab8] mb-1">500+</div>
            <div className="text-xs text-gray-600">Khách hàng</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-2xl font-bold text-[#5f7ab8] mb-1">4</div>
            <div className="text-xs text-gray-600">Thương hiệu</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-2xl font-bold text-[#5f7ab8] mb-1">24/7</div>
            <div className="text-xs text-gray-600">Hỗ trợ</div>
          </div>
        </div>

        {/* Mission & Vision - Side by Side */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border-l-4 border-[#5f7ab8] pl-6 py-4">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Sứ mệnh</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Cung cấp thiết bị công nghiệp chất lượng cao, nâng cao năng suất cho khách hàng. 
              Là cầu nối tin cậy giữa thương hiệu thế giới và thị trường Việt Nam.
            </p>
          </div>
          <div className="border-l-4 border-[#4a6199] pl-6 py-4">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Tầm nhìn</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Trở thành nhà phân phối hàng đầu Việt Nam, được tin tưởng nhờ chất lượng sản phẩm 
              và dịch vụ chuyên nghiệp.
            </p>
          </div>
        </div>

        {/* Core Values - Horizontal */}
        <div className="bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] rounded-2xl p-6 mb-8 text-white">
          <h3 className="font-bold text-lg mb-4 text-center">Giá trị cốt lõi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Chất lượng</h4>
                <p className="text-sm text-white/90">Sản phẩm chính hãng</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Tận tâm</h4>
                <p className="text-sm text-white/90">Khách hàng là ưu tiên</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Chuyên nghiệp</h4>
                <p className="text-sm text-white/90">Đội ngũ được đào tạo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid - Compact */}
        <div className="mb-8">
          <h3 className="font-bold text-xl mb-4 text-gray-900">Sản phẩm & Dịch vụ</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-xl p-5 hover:border-[#5f7ab8] transition bg-gray-50/50">
              <h4 className="font-bold text-[#5f7ab8] mb-2">Cột Tự Nâng WILL-BURT</h4>
              <p className="text-sm text-gray-700">
                Cột tự nâng hơn 100 năm lịch sử, chất lượng vượt trội cho quân sự, truyền thông và công nghiệp.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5 hover:border-[#5f7ab8] transition bg-gray-50/50">
              <h4 className="font-bold text-[#5f7ab8] mb-2">Thiết Bị HIAB</h4>
              <p className="text-sm text-gray-700">
                Cẩu tự hành, xe nâng Moffett đa dạng tải trọng, phù hợp mọi nhu cầu vận chuyển.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5 hover:border-[#5f7ab8] transition bg-gray-50/50">
              <h4 className="font-bold text-[#5f7ab8] mb-2">Thiết Bị LOVOL & LIUGONG</h4>
              <p className="text-sm text-gray-700">
                Máy móc công trình: máy xúc, máy ủi, máy san với giá cạnh tranh, hiệu suất cao.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5 hover:border-[#5f7ab8] transition bg-gray-50/50">
              <h4 className="font-bold text-[#5f7ab8] mb-2">Dịch Vụ Hậu Mãi</h4>
              <p className="text-sm text-gray-700">
                Bảo trì, bảo dưỡng, phụ tùng chính hãng. Kỹ thuật viên hỗ trợ 24/7.
              </p>
            </div>
          </div>
        </div>

        {/* Contact - Compact */}
        <div className="bg-gray-900 text-white rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 text-center">Thông tin liên hệ</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="font-semibold mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                TP. Hồ Chí Minh
              </div>
              <p className="text-xs text-white/80 mb-2">A60 Phú Thuận, Q.7, TP.HCM</p>
              <div className="space-y-1">
                <a href="tel:+842838733686" className="text-xs hover:text-[#5f7ab8] transition block">
                  ☎ +84 2838 733 686
                </a>
                <a href="mailto:info@newatlantic.vn" className="text-xs hover:text-[#5f7ab8] transition block">
                  ✉ info@newatlantic.vn
                </a>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="font-semibold mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Hà Nội
              </div>
              <p className="text-xs text-white/80 mb-2">85 Nguyễn Phong Sắc, Cầu Giấy, HN</p>
              <div className="space-y-1">
                <a href="tel:+842838733686" className="text-xs hover:text-[#5f7ab8] transition block">
                  ☎ +84 2838 733 686
                </a>
                <a href="mailto:info@newatlantic.vn" className="text-xs hover:text-[#5f7ab8] transition block">
                  ✉ info@newatlantic.vn
                </a>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <Link
              href="/lien-he"
              className="inline-block bg-[#5f7ab8] hover:bg-[#4a6199] px-6 py-2.5 rounded-lg font-semibold transition text-sm"
            >
              Liên hệ ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

