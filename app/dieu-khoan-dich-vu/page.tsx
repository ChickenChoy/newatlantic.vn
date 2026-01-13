import { generateMetadata as genMeta } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = genMeta({
  title: 'Điều Khoản Dịch Vụ',
  description: 'Điều khoản và điều kiện sử dụng dịch vụ của Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương (NEW ATLANTIC). Quy định về bảo hành, đổi trả, thanh toán và giao hàng.',
  path: '/dieu-khoan-dich-vu',
  keywords: [
    'điều khoản dịch vụ',
    'điều kiện sử dụng',
    'chính sách bảo hành',
    'chính sách đổi trả',
    'NEW ATLANTIC',
  ],
});

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] text-white pt-32 md:pt-28 pb-20 md:pb-28">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Điều Khoản Dịch Vụ</h1>
            <p className="text-xl text-gray-100">
              Quy định sử dụng sản phẩm và dịch vụ của NEW ATLANTIC
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
              
              {/* Introduction */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  Chào mừng bạn đến với <strong className="text-gray-900">Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương</strong> (NEW ATLANTIC). 
                  Khi sử dụng website và dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây. 
                  Vui lòng đọc kỹ trước khi sử dụng dịch vụ.
                </p>
              </div>

              {/* Section 1 */}
              <div className="border-l-4 border-[#5f7ab8] pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-[#5f7ab8] text-white rounded-lg flex items-center justify-center text-lg font-bold">1</span>
                  Định Nghĩa
                </h2>
                <div className="space-y-3 text-gray-600">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-gray-900">"Chúng tôi", "NEW ATLANTIC":</strong> Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-gray-900">"Khách hàng", "Bạn":</strong> Cá nhân hoặc tổ chức sử dụng dịch vụ của chúng tôi
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-gray-900">"Dịch vụ":</strong> Tất cả sản phẩm, giải pháp và dịch vụ do NEW ATLANTIC cung cấp
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-gray-900">"Website":</strong> Trang web newatlantic.vn và các subdomain liên quan
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div className="border-l-4 border-[#5f7ab8] pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-[#5f7ab8] text-white rounded-lg flex items-center justify-center text-lg font-bold">2</span>
                  Sản Phẩm & Dịch Vụ
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p className="leading-relaxed">
                    NEW ATLANTIC chuyên cung cấp thiết bị công nghiệp chất lượng cao bao gồm:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#5f7ab8]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Cột Tự Nâng WILL-BURT
                      </h3>
                      <p className="text-sm">Giải pháp nâng cao chuyên dụng cho quân sự, truyền thông và công nghiệp</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#5f7ab8]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Thiết Bị Nâng Hạ HIAB
                      </h3>
                      <p className="text-sm">Cẩu tự hành, xe nâng Moffett đa dạng tải trọng</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#5f7ab8]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Thiết Bị Công Trình LOVOL
                      </h3>
                      <p className="text-sm">Máy móc công trình hiệu suất cao, giá cạnh tranh</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#5f7ab8]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Thiết Bị Hàng Không SKYMARK
                      </h3>
                      <p className="text-sm">Thiết bị cơ giới xây dựng độ bền vượt trội</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-[#5f7ab8] p-4 rounded">
                    <p className="text-sm">
                      <strong className="text-gray-900">Lưu ý:</strong> Tất cả sản phẩm đều là hàng chính hãng, có đầy đủ giấy tờ xuất xứ và chứng nhận chất lượng.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="border-l-4 border-[#5f7ab8] pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-[#5f7ab8] text-white rounded-lg flex items-center justify-center text-lg font-bold">3</span>
                  Đặt Hàng & Thanh Toán
                </h2>
                <div className="space-y-4 text-gray-600">
                  <h3 className="font-semibold text-gray-900 text-lg">Quy trình đặt hàng:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#5f7ab8] text-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                      <div>
                        <strong className="text-gray-900">Liên hệ tư vấn:</strong> Gọi hotline hoặc gửi yêu cầu qua website
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#5f7ab8] text-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                      <div>
                        <strong className="text-gray-900">Nhận báo giá:</strong> Chúng tôi cung cấp báo giá chi tiết trong 24h
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#5f7ab8] text-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                      <div>
                        <strong className="text-gray-900">Xác nhận đơn hàng:</strong> Ký hợp đồng và thanh toán theo thỏa thuận
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#5f7ab8] text-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                      <div>
                        <strong className="text-gray-900">Giao hàng:</strong> Vận chuyển và lắp đặt (nếu có)
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 text-lg pt-4">Phương thức thanh toán:</h3>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full"></span>
                      <span>Chuyển khoản ngân hàng</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full"></span>
                      <span>Thanh toán trực tiếp tại công ty</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full"></span>
                      <span>COD (với đơn hàng phù hợp)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full"></span>
                      <span>Thanh toán theo tiến độ (đơn hàng lớn)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="border-l-4 border-[#5f7ab8] pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-[#5f7ab8] text-white rounded-lg flex items-center justify-center text-lg font-bold">4</span>
                  Giao Hàng
                </h2>
                <div className="space-y-4 text-gray-600">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Giao hàng toàn quốc với đơn vị vận chuyển uy tín</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Thời gian giao hàng tùy thuộc vào loại sản phẩm và địa điểm</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Khách hàng có trách nhiệm kiểm tra hàng hóa khi nhận</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Dịch vụ lắp đặt miễn phí hoặc có phí tùy theo thỏa thuận</span>
                    </li>
                  </ul>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-sm">
                      <strong className="text-gray-900">Quan trọng:</strong> Vui lòng thông báo ngay nếu phát hiện hàng hóa bị hư hỏng hoặc không đúng yêu cầu trong vòng 24h kể từ khi nhận hàng.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div className="border-l-4 border-[#5f7ab8] pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-[#5f7ab8] text-white rounded-lg flex items-center justify-center text-lg font-bold">5</span>
                  Bảo Hành & Đổi Trả
                </h2>
                <div className="space-y-4 text-gray-600">
                  <h3 className="font-semibold text-gray-900">Chính sách bảo hành:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900">Bảo hành chính hãng</h4>
                      </div>
                      <p className="text-sm">Theo quy định của nhà sản xuất (6-24 tháng tùy sản phẩm)</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900">Hỗ trợ kỹ thuật</h4>
                      </div>
                      <p className="text-sm">Tư vấn và hỗ trợ kỹ thuật 24/7 suốt vòng đời sản phẩm</p>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 pt-4">Điều kiện đổi trả:</h3>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Sản phẩm bị lỗi kỹ thuật do nhà sản xuất</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Giao sai sản phẩm hoặc thiếu phụ kiện</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Sản phẩm hư hỏng trong quá trình vận chuyển</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Còn nguyên bao bì, tem niêm phong (nếu có)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 6 */}
              <div className="border-l-4 border-[#5f7ab8] pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-[#5f7ab8] text-white rounded-lg flex items-center justify-center text-lg font-bold">6</span>
                  Trách Nhiệm Người Dùng
                </h2>
                <div className="space-y-3 text-gray-600">
                  <p className="leading-relaxed">Khi sử dụng dịch vụ của chúng tôi, bạn cam kết:</p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Cung cấp thông tin chính xác và đầy đủ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Sử dụng sản phẩm đúng mục đích và hướng dẫn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Không sử dụng dịch vụ cho mục đích bất hợp pháp</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Tuân thủ các quy định về an toàn lao động</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Bảo quản và bảo trì sản phẩm theo hướng dẫn</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 7 */}
              <div className="border-l-4 border-[#5f7ab8] pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-[#5f7ab8] text-white rounded-lg flex items-center justify-center text-lg font-bold">7</span>
                  Giới Hạn Trách Nhiệm
                </h2>
                <div className="space-y-3 text-gray-600">
                  <p className="leading-relaxed">NEW ATLANTIC không chịu trách nhiệm cho:</p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Thiệt hại do sử dụng sai mục đích hoặc không tuân thủ hướng dẫn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Hư hỏng do tác động của thiên tai, hỏa hoạn, chiến tranh</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Sản phẩm đã qua sửa chữa bởi bên thứ ba không được ủy quyền</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Thông tin sai lệch do khách hàng cung cấp</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 8 */}
              <div className="border-l-4 border-[#5f7ab8] pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-[#5f7ab8] text-white rounded-lg flex items-center justify-center text-lg font-bold">8</span>
                  Quyền Sở Hữu Trí Tuệ
                </h2>
                <div className="space-y-3 text-gray-600">
                  <p className="leading-relaxed">
                    Tất cả nội dung trên website bao gồm văn bản, hình ảnh, logo, thiết kế đều thuộc quyền sở hữu của NEW ATLANTIC hoặc các đối tác. 
                    Nghiêm cấm sao chép, phân phối hoặc sử dụng mà không có sự cho phép bằng văn bản.
                  </p>
                </div>
              </div>

              {/* Section 9 */}
              <div className="border-l-4 border-[#5f7ab8] pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-[#5f7ab8] text-white rounded-lg flex items-center justify-center text-lg font-bold">9</span>
                  Giải Quyết Tranh Chấp
                </h2>
                <div className="space-y-3 text-gray-600">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Mọi tranh chấp sẽ được giải quyết thông qua thương lượng và hòa giải</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Nếu không đạt được thỏa thuận, tranh chấp sẽ được đưa ra Tòa án có thẩm quyền tại TP. Hồ Chí Minh</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#5f7ab8] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Điều khoản này tuân thủ theo pháp luật Việt Nam</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Section */}
              <div className="bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Liên Hệ & Hỗ Trợ</h2>
                <p className="mb-6 text-gray-100">
                  Nếu bạn có câu hỏi về điều khoản dịch vụ hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Thông tin liên hệ:</h3>
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
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Địa chỉ:</h3>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">A60 Phú Thuận, Phường Phú Thuận, Quận 7, TP. Hồ Chí Minh</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Notice */}
              <div className="text-center pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Điều khoản này có hiệu lực từ ngày {new Date().toLocaleDateString('vi-VN')}.<br />
                  NEW ATLANTIC có quyền cập nhật điều khoản này mà không cần thông báo trước. Phiên bản mới nhất luôn được đăng tải trên website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

