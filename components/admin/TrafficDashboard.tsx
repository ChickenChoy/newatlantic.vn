'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Icon } from '@iconify/react';

// Dynamic imports to avoid SSR issues with Chart.js
const TrafficChart = dynamic(
    () => import('./charts/TrafficChart'),
    {
        ssr: false,
        loading: () => (
            <div className="bg-white dark:bg-darkgray rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-[450px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }
);

const DevicePieChart = dynamic(
    () => import('./charts/DevicePieChart'),
    {
        ssr: false,
        loading: () => (
            <div className="bg-white dark:bg-darkgray rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-[380px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        )
    }
);

const BrowserPieChart = dynamic(
    () => import('./charts/BrowserPieChart'),
    {
        ssr: false,
        loading: () => (
            <div className="bg-white dark:bg-darkgray rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-[380px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }
);

const RealTimeVisitors = dynamic(
    () => import('./charts/RealTimeVisitors'),
    {
        ssr: false,
        loading: () => (
            <div className="bg-white dark:bg-darkgray rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-[380px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        )
    }
);

export default function TrafficDashboard() {
    const [showSetup, setShowSetup] = useState(false);
    const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

    useEffect(() => {
        // Check if GA4 is configured
        fetch('/api/analytics?period=7d')
            .then(res => res.json())
            .then(data => {
                setIsConfigured(data.configured && !data.simulated);
            })
            .catch(() => setIsConfigured(false));
    }, []);

    return (
        <div className="space-y-6">
            {/* GA4 Configure Button - compact */}
            {isConfigured === false && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setShowSetup(!showSetup)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Icon icon="solar:settings-line-duotone" height={18} />
                        Cấu hình GA4
                    </button>
                </div>
            )}

            {/* GA4 Setup Guide */}
            {showSetup && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center flex-shrink-0">
                            <Icon icon="logos:google-analytics" height={28} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Hướng dẫn cấu hình Google Analytics 4
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                Để hiển thị dữ liệu thực từ website, cần thực hiện các bước sau:
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Tạo GA4 Property</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Truy cập <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Google Analytics</a> → Tạo property mới hoặc sử dụng property có sẵn.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Lấy Property ID</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Vào Admin → Property Settings → Sao chép <strong>Property ID</strong> (dạng số, ví dụ: 123456789)
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Tạo Service Account</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Truy cập <a href="https://console.cloud.google.com/iam-admin/serviceaccounts" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Google Cloud Console</a> → Tạo Service Account → Download JSON key
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">4</span>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Cấp quyền cho Service Account</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Trong GA4 → Admin → Property Access Management → Thêm email của service account với quyền <strong>Viewer</strong>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">5</span>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Thêm Environment Variables</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            Thêm vào file <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">.env.local</code>:
                                        </p>
                                        <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
                                            {`GA4_PROPERTY_ID=123456789
GOOGLE_ANALYTICS_CREDENTIALS='{"type":"service_account",...}'`}
                                        </pre>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Hoặc đặt <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">GOOGLE_APPLICATION_CREDENTIALS</code> trỏ đến file JSON
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-700">
                                <button
                                    onClick={() => setShowSetup(false)}
                                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    ← Đóng hướng dẫn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Traffic Chart - Full Width */}
            <TrafficChart />

            {/* Bottom Section: 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Real-time Visitors */}
                <RealTimeVisitors />

                {/* Device Distribution */}
                <DevicePieChart />

                {/* Browser Distribution */}
                <BrowserPieChart />
            </div>

            {/* Status Note */}
            {isConfigured === false && !showSetup && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-start gap-3">
                    <Icon icon="solar:info-circle-line-duotone" className="text-yellow-500 flex-shrink-0 mt-0.5" height={20} />
                    <div>
                        <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                            Đang hiển thị dữ liệu mô phỏng
                        </h4>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                            Click vào nút <strong>&quot;Cấu hình GA4&quot;</strong> phía trên để kết nối Google Analytics 4 và xem dữ liệu thực.
                        </p>
                    </div>
                </div>
            )}

            {isConfigured === true && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-start gap-3">
                    <Icon icon="solar:check-circle-line-duotone" className="text-green-500 flex-shrink-0 mt-0.5" height={20} />
                    <div>
                        <h4 className="font-medium text-green-700 dark:text-green-300 mb-1">
                            ✓ Đã kết nối Google Analytics 4
                        </h4>
                        <p className="text-sm text-green-600 dark:text-green-400">
                            Dữ liệu đang được cập nhật từ tài khoản GA4 của bạn.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
