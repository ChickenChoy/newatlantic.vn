'use client';

import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';

interface RecentPage {
    page: string;
    time: string;
}

export default function RealTimeVisitors() {
    const [visitors, setVisitors] = useState(0);
    const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
    const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
    const [isLive, setIsLive] = useState(true);
    const [isSimulated, setIsSimulated] = useState(false);
    const [todayStats, setTodayStats] = useState({ sessions: 0, pageviews: 0 });

    const fetchRealtimeData = useCallback(async () => {
        try {
            const res = await fetch('/api/analytics?period=7d');
            const data = await res.json();

            const newVisitors = data.data?.realtime?.activeUsers || 0;

            setVisitors(prev => {
                if (newVisitors > prev) setTrend('up');
                else if (newVisitors < prev) setTrend('down');
                else setTrend('stable');
                return newVisitors;
            });

            setIsSimulated(data.simulated);

            // Calculate today's stats from traffic data
            if (data.data?.traffic?.length > 0) {
                const today = data.data.traffic[data.data.traffic.length - 1];
                setTodayStats({
                    sessions: today?.sessions || 0,
                    pageviews: today?.pageviews || 0,
                });
            }

        } catch (err) {
            console.error('Failed to fetch realtime data:', err);
        }
    }, []);

    useEffect(() => {
        // Initial fetch
        fetchRealtimeData();

        // Generate initial recent pages (simulated for now - would need server-sent events for real data)
        const pages = [
            { page: '/san-pham/may-phat-dien', time: 'vừa xong' },
            { page: '/lien-he', time: '1 phút trước' },
            { page: '/', time: '2 phút trước' },
        ];
        setRecentPages(pages);

        // Update every 30 seconds when live
        const interval = setInterval(() => {
            if (isLive) {
                fetchRealtimeData();

                // Simulate page activity (in real implementation, this would use SSE or WebSocket)
                if (Math.random() > 0.3) {
                    const randomPages = [
                        '/san-pham/may-phat-dien',
                        '/san-pham/can-cau',
                        '/tin-tuc',
                        '/lien-he',
                        '/thu-vien-hinh-anh',
                        '/',
                        '/gioi-thieu',
                    ];
                    const newPage = randomPages[Math.floor(Math.random() * randomPages.length)];
                    setRecentPages(prev => {
                        const updated = [
                            { page: newPage, time: 'vừa xong' },
                            ...prev.slice(0, 2).map((p, i) => ({
                                ...p,
                                time: i === 0 ? '30 giây trước' : '1 phút trước',
                            })),
                        ];
                        return updated;
                    });
                }
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [isLive, fetchRealtimeData]);

    // Reset trend indicator after animation
    useEffect(() => {
        if (trend !== 'stable') {
            const timer = setTimeout(() => setTrend('stable'), 1000);
            return () => clearTimeout(timer);
        }
    }, [trend]);

    return (
        <div className="bg-white dark:bg-darkgray rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center relative">
                        <Icon icon="solar:users-group-rounded-line-duotone" className="text-green-600" height={22} />
                        {/* Live indicator */}
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${isLive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                        </span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Đang trực tuyến</h3>
                            {isSimulated && (
                                <span className="px-1.5 py-0.5 text-[9px] font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                    Mô phỏng
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Cập nhật mỗi 30 giây</p>
                    </div>
                </div>

                {/* Live toggle */}
                <button
                    onClick={() => setIsLive(!isLive)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${isLive
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                >
                    {isLive ? 'LIVE' : 'PAUSED'}
                </button>
            </div>

            {/* Main counter */}
            <div className="text-center py-6">
                <div className="relative inline-flex items-center justify-center">
                    <div
                        className={`text-6xl font-bold transition-all duration-300 ${trend === 'up' ? 'text-green-600 scale-110' :
                                trend === 'down' ? 'text-red-600 scale-90' :
                                    'text-gray-900 dark:text-white'
                            }`}
                    >
                        {visitors}
                    </div>
                    {/* Trend indicator */}
                    {trend !== 'stable' && (
                        <div className={`absolute -right-6 top-0 transition-opacity duration-300 ${trend === 'up' ? 'text-green-500' : 'text-red-500'
                            }`}>
                            <Icon
                                icon={trend === 'up' ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'}
                                height={20}
                            />
                        </div>
                    )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    người đang xem website
                </p>
            </div>

            {/* Recent Activity */}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Hoạt động gần đây
                </h4>
                <div className="space-y-2">
                    {recentPages.map((activity, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-between py-1.5 transition-all duration-300 ${index === 0 && recentPages[0]?.time === 'vừa xong' ? 'bg-green-50 dark:bg-green-900/10 -mx-2 px-2 rounded-lg' : ''
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Icon
                                    icon="solar:eye-line-duotone"
                                    className={index === 0 ? 'text-green-500' : 'text-gray-400'}
                                    height={16}
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
                                    {activity.page}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                {activity.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {todayStats.sessions.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Phiên hôm nay</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {todayStats.pageviews.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Pageviews</div>
                </div>
            </div>
        </div>
    );
}
