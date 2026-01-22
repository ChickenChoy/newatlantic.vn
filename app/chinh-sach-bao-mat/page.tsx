import { generateMetadata as genMeta } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = genMeta({
  title: 'Chính Sách Bảo Mật',
  description: 'Chính sách bảo mật thông tin khách hàng của Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương (NEW ATLANTIC). Cam kết bảo vệ quyền riêng tư và an toàn thông tin cá nhân.',
  path: '/chinh-sach-bao-mat',
  keywords: [
    'chính sách bảo mật',
    'bảo mật thông tin',
    'quyền riêng tư',
    'NEW ATLANTIC',
    'Tân Đại Tây Dương',
  ],
});

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050c3a] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-[#0a1654] border-b border-white/10 text-white pt-32 md:pt-28 pb-20 md:pb-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
              CẬP NHẬT: {new Date().toLocaleDateString('vi-VN')}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Chính Sách Bảo Mật</h1>
            <p className="text-xl text-gray-100">
              Cam kết bảo vệ thông tin cá nhân của khách hàng
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 p-8 md:p-12 space-y-8">
              
              {/* Introduction */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-300 leading-relaxed">
                  Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương (NEW ATLANTIC) cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn.
                </p>
              </div>

              {/* Section 1 */}
              <div className="border-l-4 border-blue-400 pl-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center text-lg font-bold">1</span>
                  Thu Thập Thông Tin
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Chúng tôi thu thập thông tin khi bạn:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Đăng ký tài khoản hoặc liên hệ với chúng tôi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Yêu cầu báo giá hoặc tư vấn sản phẩm</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Đặt hàng sản phẩm hoặc dịch vụ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Tham gia khảo sát hoặc chương trình khuyến mãi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Truy cập và sử dụng website của chúng tôi</span>
                    </li>
                  </ul>
                  <div className="bg-white/5 rounded-xl p-6 mt-4">
                    <h3 className="font-semibold text-white mb-3">Thông tin chúng tôi có thể thu thập:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Họ tên, chức vụ, tên công ty
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Địa chỉ email, số điện thoại
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Địa chỉ giao hàng và thanh toán
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Thông tin kỹ thuật (IP, trình duyệt, thiết bị)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="border-l-4 border-blue-400 pl-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center text-lg font-bold">2</span>
                  Mục Đích Sử Dụng Thông Tin
                </h2>
                <div className="space-y-3 text-gray-300">
                  <p className="leading-relaxed">Thông tin của bạn được sử dụng để:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-white">Xử lý đơn hàng:</strong> Xác nhận, giao hàng và hỗ trợ sau bán hàng
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-white">Tư vấn kỹ thuật:</strong> Cung cấp thông tin sản phẩm và giải pháp phù hợp
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-white">Cải thiện dịch vụ:</strong> Nâng cao chất lượng sản phẩm và trải nghiệm khách hàng
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-white">Marketing:</strong> Gửi thông tin khuyến mãi, sản phẩm mới (chỉ khi có sự đồng ý)
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-white">Tuân thủ pháp luật:</strong> Đáp ứng các yêu cầu pháp lý và quy định
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div className="border-l-4 border-blue-400 pl-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center text-lg font-bold">3</span>
                  Bảo Mật Thông Tin
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt để bảo vệ thông tin của bạn:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-5">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-white mb-2">Mã hóa dữ liệu</h3>
                      <p className="text-sm">Sử dụng SSL/TLS để bảo vệ thông tin truyền tải</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-5">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-white mb-2">Kiểm soát truy cập</h3>
                      <p className="text-sm">Chỉ nhân viên được ủy quyền mới có quyền truy cập</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-5">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-white mb-2">Máy chủ an toàn</h3>
                      <p className="text-sm">Lưu trữ trên hệ thống máy chủ bảo mật cao</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-5">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-white mb-2">Sao lưu định kỳ</h3>
                      <p className="text-sm">Backup dữ liệu thường xuyên để đảm bảo an toàn</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="border-l-4 border-blue-400 pl-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center text-lg font-bold">4</span>
                  Chia Sẻ Thông Tin
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Chúng tôi <strong className="text-white">KHÔNG</strong> bán, trao đổi hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba. Thông tin chỉ được chia sẻ trong các trường hợp:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>Đối tác vận chuyển:</strong> Để giao hàng đến địa chỉ của bạn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>Nhà cung cấp dịch vụ:</strong> Hỗ trợ vận hành website và thanh toán</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>Yêu cầu pháp lý:</strong> Khi được yêu cầu bởi cơ quan có thẩm quyền</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>Có sự đồng ý:</strong> Khi bạn cho phép chia sẻ thông tin</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 5 */}
              <div className="border-l-4 border-blue-400 pl-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center text-lg font-bold">5</span>
                  Quyền Của Bạn
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">Bạn có các quyền sau đối với thông tin cá nhân của mình:</p>
                  <div className="bg-white/5 rounded-xl p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <strong className="text-white">Quyền truy cập:</strong> Yêu cầu xem thông tin chúng tôi đang lưu trữ
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <strong className="text-white">Quyền chỉnh sửa:</strong> Cập nhật hoặc sửa đổi thông tin không chính xác
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <strong className="text-white">Quyền xóa:</strong> Yêu cầu xóa thông tin cá nhân (trong phạm vi cho phép)
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <strong className="text-white">Quyền từ chối:</strong> Không nhận email marketing hoặc tin khuyến mãi
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div className="border-l-4 border-blue-400 pl-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center text-lg font-bold">6</span>
                  Cookies
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Website sử dụng cookies để cải thiện trải nghiệm người dùng. Cookies giúp chúng tôi:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Ghi nhớ thông tin đăng nhập và tùy chọn của bạn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Phân tích lưu lượng truy cập và hành vi người dùng</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Cải thiện hiệu suất và chức năng website</span>
                    </li>
                  </ul>
                  <p className="text-sm bg-yellow-500/10 border-l-4 border-yellow-400 p-4 rounded text-gray-300">
                    <strong>Lưu ý:</strong> Bạn có thể từ chối cookies thông qua cài đặt trình duyệt, tuy nhiên điều này có thể ảnh hưởng đến trải nghiệm sử dụng website.
                  </p>
                </div>
              </div>

              {/* Contact Section */}
              <div className="bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Liên Hệ</h2>
                <p className="mb-6 text-gray-100">
                  Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này hoặc muốn thực hiện các quyền của mình, vui lòng liên hệ:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <a href="mailto:info@newatlantic.vn" className="hover:text-gray-200 transition">info@newatlantic.vn</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <a href="tel:+842838733686" className="hover:text-gray-200 transition">+84 2838 733 686</a>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>A60 Phú Thuận, Phường Phú Thuận, Quận 7, TP. Hồ Chí Minh</span>
                  </div>
                </div>
              </div>

              {/* Update Notice */}
              <div className="text-center pt-8 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  Chính sách này có hiệu lực từ ngày {new Date().toLocaleDateString('vi-VN')}.<br />
                  Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi sẽ được thông báo trên website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

