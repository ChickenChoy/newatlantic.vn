'use client';

import { toast } from '@/components/ToastProvider';

export default function ToastDemo() {
    return (
        <div className="min-h-screen bg-[#050c3a] pt-32 pb-20">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-4">Toast Notifications Demo</h1>
                    <p className="text-white/70 mb-12">Click các button để test toast notifications</p>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Success */}
                        <button
                            onClick={() => toast.success('Đã thêm vào giỏ hàng thành công!')}
                            className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                        >
                            ✅ Success Toast
                        </button>

                        {/* Error */}
                        <button
                            onClick={() => toast.error('Có lỗi xảy ra. Vui lòng thử lại!')}
                            className="px-6 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                        >
                            ❌ Error Toast
                        </button>

                        {/* Warning */}
                        <button
                            onClick={() => toast.warning('Sản phẩm này sắp hết hàng!')}
                            className="px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                        >
                            ⚠️ Warning Toast
                        </button>

                        {/* Info */}
                        <button
                            onClick={() => toast.info('Thông tin đã được cập nhật')}
                            className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                        >
                            ℹ️ Info Toast
                        </button>

                        {/* Custom Duration */}
                        <button
                            onClick={() => toast.success('Toast hiển thị lâu hơn (8 giây)', { duration: 8000 })}
                            className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                        >
                            ⏱️ Long Duration
                        </button>

                        {/* Different Position */}
                        <button
                            onClick={() => toast.success('Toast ở top-left!', { position: 'top-left' })}
                            className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                        >
                            📍 Top Left
                        </button>
                    </div>

                    {/* Use Cases Examples */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-white mb-6">Real Use Cases</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => toast.success('Đã thêm vào yêu thích')}
                                className="w-full px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-all text-left"
                            >
                                💝 Add to Wishlist
                            </button>

                            <button
                                onClick={() => toast.success('Đã gửi yêu cầu tư vấn. Chúng tôi sẽ liên hệ sớm nhất!')}
                                className="w-full px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-all text-left"
                            >
                                📧 Contact Form Submitted
                            </button>

                            <button
                                onClick={() => toast.info('Đang tải thêm sản phẩm...', { duration: 2000 })}
                                className="w-full px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-all text-left"
                            >
                                🔄 Loading More Products
                            </button>

                            <button
                                onClick={() => toast.warning('Vui lòng đăng nhập để tiếp tục')}
                                className="w-full px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-all text-left"
                            >
                                🔐 Authentication Required
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
