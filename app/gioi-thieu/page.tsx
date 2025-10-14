import Link from 'next/link';

export const metadata = {
  title: 'Giới thiệu - NEW AIT',
  description: 'Giới thiệu về công ty Tân Đại Tây Dương - Nhà phân phối thiết bị công nghiệp hàng đầu Việt Nam',
};

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#5f7ab8] via-[#4a6199] to-[#3a4d7a] text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -top-48 -right-48"></div>
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -bottom-48 -left-48"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-bold mb-4">Giới Thiệu Về NEW AIT</h1>
          <p className="text-xl text-gray-100">
            Tân Đại Tây Dương - Đối tác tin cậy trong lĩnh vực thiết bị công nghiệp
          </p>
        </div>
      </div>

      {/* Company Overview */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold mb-6">Về Chúng Tôi</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              <strong>Công ty Cổ Phần Thương Mại Quốc Tế Tân Đại Tây Dương (NEW AIT)</strong> là nhà phân phối 
              hàng đầu tại Việt Nam cho các thương hiệu thiết bị công nghiệp nổi tiếng thế giới như 
              <strong> WILL-BURT, HIAB, LOVOL, LIUGONG</strong>.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Với nhiều năm kinh nghiệm trong lĩnh vực cung cấp thiết bị công nghiệp, chúng tôi tự hào là 
              đối tác tin cậy của hàng trăm doanh nghiệp tại Việt Nam. Chúng tôi cam kết mang đến cho 
              khách hàng những sản phẩm chất lượng cao nhất với giá cả cạnh tranh và dịch vụ hậu mãi chu đáo.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-stretch">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:border-[#5f7ab8] transition-all flex flex-col">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-4">Sứ Mệnh</h3>
            <p className="text-gray-700">
              Cung cấp các giải pháp thiết bị công nghiệp chất lượng cao, góp phần nâng cao 
              năng suất và hiệu quả công việc cho khách hàng. Trở thành cầu nối đáng tin cậy 
              giữa các thương hiệu hàng đầu thế giới và thị trường Việt Nam.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:border-[#5f7ab8] transition-all flex flex-col">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-4">Tầm Nhìn</h3>
            <p className="text-gray-700">
              Trở thành nhà phân phối thiết bị công nghiệp hàng đầu Việt Nam, được khách hàng 
              tin tưởng và lựa chọn bởi chất lượng sản phẩm, dịch vụ chuyên nghiệp và sự cam kết 
              trong mỗi hợp tác.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-8 border border-gray-100">
          <h2 className="text-4xl font-bold mb-10 text-center">Giá Trị Cốt Lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <div className="text-center">
              <div className="bg-gradient-to-br from-[#5f7ab8]/10 to-[#4a6199]/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 border-2 border-[#5f7ab8]/20">
                <svg className="w-10 h-10 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2">Chất Lượng</h4>
              <p className="text-gray-600">Cam kết cung cấp sản phẩm chính hãng, chất lượng cao nhất</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-[#5f7ab8]/10 to-[#4a6199]/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 border-2 border-[#5f7ab8]/20">
                <svg className="w-10 h-10 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2">Tận Tâm</h4>
              <p className="text-gray-600">Đặt lợi ích khách hàng lên hàng đầu, hỗ trợ 24/7</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-[#5f7ab8]/10 to-[#4a6199]/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 border-2 border-[#5f7ab8]/20">
                <svg className="w-10 h-10 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2">Chuyên Nghiệp</h4>
              <p className="text-gray-600">Đội ngũ kỹ thuật được đào tạo bài bản, chuyên sâu</p>
            </div>
          </div>
        </div>

        {/* Our Products & Services */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold mb-6">Sản Phẩm & Dịch Vụ</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="text-2xl">✓</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Cột Tự Nâng WILL-BURT</h4>
                <p className="text-gray-700">
                  Cột tự nâng với hơn 100 năm lịch sử, chất lượng vượt trội, được sử dụng rộng rãi 
                  trong quân sự, truyền thông, và công nghiệp.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">✓</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Thiết Bị Nâng Hạ HIAB</h4>
                <p className="text-gray-700">
                  Cẩu tự hành, xe nâng Moffett với nhiều tải trọng và kích thước khác nhau, 
                  phù hợp với mọi nhu cầu vận chuyển và xây dựng.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">✓</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Thiết Bị Công Trình LOVOL & LIUGONG</h4>
                <p className="text-gray-700">
                  Máy móc công trình chất lượng cao: máy xúc, máy ủi, máy san gạt... 
                  với giá cả cạnh tranh và hiệu suất vượt trội.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">✓</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Dịch Vụ Hậu Mãi</h4>
                <p className="text-gray-700">
                  Bảo trì, bảo dưỡng, cung cấp phụ tùng thay thế chính hãng. 
                  Đội ngũ kỹ thuật viên sẵn sàng hỗ trợ 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] text-white rounded-3xl shadow-xl p-12 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl top-0 right-0"></div>
            <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl bottom-0 left-0"></div>
          </div>
          <h2 className="text-4xl font-bold mb-10 text-center relative z-10">Thông Tin Liên Hệ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 items-stretch">
            <div>
              <h3 className="text-xl font-bold mb-4">🏢 Trụ Sở Chính - TP.HCM</h3>
              <p className="mb-2">A60 Đường Phú Thuận</p>
              <p className="mb-4">Phường Phú Thuận, Quận 7, TP.HCM</p>
              <p className="mb-2">📞 +84 2838 733 686</p>
              <p>📧 info@newatlantic.vn</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">🏢 Văn Phòng Hà Nội</h3>
              <p className="mb-2">Số 85 Đường Nguyễn Phong Sắc</p>
              <p className="mb-4">Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội</p>
              <p className="mb-2">📞 +84 2838 733 686</p>
              <p>📧 info@newatlantic.vn</p>
            </div>
          </div>
          <div className="text-center mt-12 relative z-10">
            <Link
              href="/lien-he"
              className="inline-block bg-white text-[#5f7ab8] px-10 py-4 rounded-xl font-bold hover:bg-gray-100 hover:scale-105 transition-all shadow-xl"
            >
              Liên hệ với chúng tôi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

