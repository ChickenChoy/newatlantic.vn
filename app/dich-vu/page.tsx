import Link from 'next/link';
import { services } from '@/lib/data';

export const metadata = {
  title: 'Dịch vụ - NEW AIT',
  description: 'Dịch vụ cung cấp và thi công thiết bị công nghiệp chuyên nghiệp',
};

export default function ServicesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#5f7ab8] via-[#4a6199] to-[#3a4d7a] text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -top-48 -right-48"></div>
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -bottom-48 -left-48"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-bold mb-4">Dịch Vụ</h1>
          <p className="text-xl text-gray-100">
            Cung cấp giải pháp toàn diện về thiết bị công nghiệp
          </p>
        </div>
      </div>

      {/* Main Services */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center">Dịch Vụ Chính</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-stretch">
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all border border-gray-100 hover:border-[#5f7ab8] flex flex-col">
            <div className="text-5xl mb-4">🔥</div>
            <h3 className="text-2xl font-bold mb-4">Thiết Bị Vật Tư PCCC</h3>
            <p className="text-gray-700 mb-4">
              Cung cấp và thi công hệ thống phòng cháy chữa cháy chuyên nghiệp, 
              đảm bảo tiêu chuẩn an toàn cao nhất.
            </p>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>• Cung ứng vật tư PCCC</li>
              <li>• Tư vấn hệ thống PCCC</li>
              <li>• Thi công lắp đặt hệ thống PCCC</li>
              <li>• Bảo trì bảo dưỡng định kỳ</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all border border-gray-100 hover:border-[#5f7ab8] flex flex-col">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold mb-4">Thiết Bị Ngành Điện</h3>
            <p className="text-gray-700 mb-4">
              Cung ứng và tư vấn hệ thống điện công nghiệp, đảm bảo vận hành 
              ổn định và an toàn.
            </p>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>• Cung ứng vật tư điện</li>
              <li>• Tư vấn thi công mạng lưới điện</li>
              <li>• Lắp đặt hệ thống điện</li>
              <li>• Bảo trì bảo dưỡng vật tư điện</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all border border-gray-100 hover:border-[#5f7ab8] flex flex-col">
            <div className="text-5xl mb-4">🏗️</div>
            <h3 className="text-2xl font-bold mb-4">Thiết Bị Chuyên Ngành</h3>
            <p className="text-gray-700 mb-4">
              Cung cấp thiết bị chuyên dụng cho các ngành công nghiệp, xây dựng, 
              và quốc phòng.
            </p>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>• Cẩu tự hành HIAB</li>
              <li>• Thiết bị cơ giới LOVOL, LIUGONG</li>
              <li>• Cột tự nâng WILL-BURT</li>
              <li>• Xe nâng Moffett</li>
            </ul>
          </div>
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold mb-8">Dịch Vụ Khác</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-3xl">🚜</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Cẩu Tự Hành</h4>
                <p className="text-gray-700">
                  Cung cấp và cho thuê cẩu tự hành HIAB với nhiều tải trọng khác nhau
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🔧</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Phụ Tùng Thay Thế</h4>
                <p className="text-gray-700">
                  Cung cấp đầy đủ phụ tùng thay thế chính hãng cho các thiết bị
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🛡️</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Giải Pháp Chống UAV</h4>
                <p className="text-gray-700">
                  Hệ thống chống UAV hiện đại cho an ninh quốc phòng
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🌊</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Hệ Thống Tuần Thám Biển</h4>
                <p className="text-gray-700">
                  Giải pháp giám sát và tuần thám biển chuyên nghiệp
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">⚙️</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Dầu Nhớt & Lốp Xe</h4>
                <p className="text-gray-700">
                  Cung cấp dầu nhớt Petronas và lốp xe chất lượng cao
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🔋</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Bình Acquy</h4>
                <p className="text-gray-700">
                  Cung cấp bình acquy chính hãng cho các loại thiết bị
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] text-white rounded-2xl shadow-xl p-12 mb-8 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl top-0 right-0"></div>
          </div>
          <h2 className="text-4xl font-bold mb-8 text-center relative z-10">Tại Sao Chọn Chúng Tôi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 items-stretch">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex flex-col">
              <div className="text-5xl mb-4 text-center">✓</div>
              <h4 className="text-xl font-bold mb-2 text-center">Sản Phẩm Chính Hãng</h4>
              <p className="text-gray-100 text-center">
                100% sản phẩm nhập khẩu chính hãng từ các thương hiệu hàng đầu thế giới
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex flex-col">
              <div className="text-5xl mb-4 text-center">✓</div>
              <h4 className="text-xl font-bold mb-2 text-center">Bảo Hành Toàn Diện</h4>
              <p className="text-gray-100 text-center">
                Chế độ bảo hành chính hãng, hỗ trợ kỹ thuật 24/7
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex flex-col">
              <div className="text-5xl mb-4 text-center">✓</div>
              <h4 className="text-xl font-bold mb-2 text-center">Giá Cạnh Tranh</h4>
              <p className="text-gray-100 text-center">
                Cam kết giá tốt nhất thị trường với chất lượng đảm bảo
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <h2 className="text-4xl font-bold mb-4">Cần Tư Vấn Dịch Vụ?</h2>
          <p className="text-gray-700 text-xl mb-8">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn chi tiết về dịch vụ phù hợp
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+842838733686"
              className="bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              +84 2838 733 686
            </a>
            <Link
              href="/lien-he"
              className="bg-white border-2 border-[#5f7ab8] text-[#5f7ab8] px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#5f7ab8] hover:text-white transition-all inline-flex items-center justify-center gap-2"
            >
              Gửi yêu cầu tư vấn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

