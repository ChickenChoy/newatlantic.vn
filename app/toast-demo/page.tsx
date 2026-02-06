'use client';

import { toast } from '@/components/ToastProvider';
import { useState } from 'react';

export default function ToastDemo() {
    const [deleteResult, setDeleteResult] = useState<string>('');
    const [logoutResult, setLogoutResult] = useState<string>('');

    const handleDelete = async () => {
        const confirmed = await toast.confirm({
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc muốn xóa mục này? Hành động này không thể hoàn tác.',
            confirmText: 'Xóa',
            cancelText: 'Hủy',
            type: 'danger',
        });

        setDeleteResult(confirmed ? 'Đã xóa thành công!' : 'Đã hủy xóa');
        if (confirmed) {
            toast.success('Đã xóa mục thành công!');
        }
    };

    const handleLogout = async () => {
        const confirmed = await toast.confirm({
            title: 'Đăng xuất',
            message: 'Bạn có muốn đăng xuất khỏi tài khoản?',
            confirmText: 'Đăng xuất',
            cancelText: 'Ở lại',
            type: 'warning',
        });

        setLogoutResult(confirmed ? 'Đã đăng xuất' : 'Đã hủy đăng xuất');
        if (confirmed) {
            toast.info('Đã đăng xuất thành công');
        }
    };

    const handleBulkDelete = async () => {
        const confirmed = await toast.confirm({
            message: 'Bạn có chắc muốn xóa 5 sản phẩm đã chọn?',
            confirmText: 'Xóa tất cả',
            type: 'danger',
        });

        if (confirmed) {
            toast.success('Đã xóa 5 sản phẩm thành công!');
        }
    };

    return (
        <div className="min-h-screen bg-[#050c3a] pt-32 pb-20">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-4">Toast Notifications Demo</h1>
                    <p className="text-white/70 mb-12">Click các button để test toast notifications và confirm dialogs</p>

                    {/* Confirm Dialog Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-6">Confirm Dialogs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={handleDelete}
                                className="px-6 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                            >
                                🗑️ Delete Item (Danger)
                            </button>

                            <button
                                onClick={handleLogout}
                                className="px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                            >
                                🚪 Logout (Warning)
                            </button>

                            <button
                                onClick={handleBulkDelete}
                                className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                            >
                                📦 Bulk Delete (No Title)
                            </button>

                            <button
                                onClick={async () => {
                                    const confirmed = await toast.confirm({
                                        title: 'Thông tin',
                                        message: 'Bạn có muốn tiếp tục với hành động này?',
                                        confirmText: 'Tiếp tục',
                                        cancelText: 'Quay lại',
                                        type: 'info',
                                    });
                                    if (confirmed) {
                                        toast.success('Đã xác nhận!');
                                    }
                                }}
                                className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                            >
                                ℹ️ Info Confirm
                            </button>
                        </div>

                        {/* Results Display */}
                        <div className="mt-6 space-y-2">
                            {deleteResult && (
                                <div className="px-4 py-3 bg-white/10 text-white rounded-lg">
                                    Delete Result: {deleteResult}
                                </div>
                            )}
                            {logoutResult && (
                                <div className="px-4 py-3 bg-white/10 text-white rounded-lg">
                                    Logout Result: {logoutResult}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Toast Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-6">Toast Notifications</h2>
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

                            <button
                                onClick={async () => {
                                    const confirmed = await toast.confirm({
                                        title: 'Xác nhận thanh toán',
                                        message: 'Bạn có muốn tiến hành thanh toán với tổng số tiền 15,000,000 VNĐ?',
                                        confirmText: 'Thanh toán',
                                        cancelText: 'Hủy',
                                        type: 'info',
                                    });
                                    if (confirmed) {
                                        toast.success('Đang xử lý thanh toán...');
                                    }
                                }}
                                className="w-full px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-all text-left"
                            >
                                💳 Confirm Payment
                            </button>
                        </div>
                    </div>

                    {/* Keyboard Shortcuts Info */}
                    <div className="mt-16 p-6 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-3">Keyboard Shortcuts</h3>
                        <div className="space-y-2 text-sm text-white/70">
                            <div className="flex justify-between">
                                <span>ESC</span>
                                <span>Cancel confirm dialog</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Ctrl + Enter</span>
                                <span>Confirm action</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
