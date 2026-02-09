'use client';

import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';

interface DailyData {
    date: string;
    pageviews: number;
    visitors: number;
}

interface TopPage {
    path: string;
    count: number;
}

interface TrafficData {
    activeUsers: number;
    today: { pageviews: number; visitors: number };
    week: { pageviews: number; visitors: number };
    daily: DailyData[];
    topPages: TopPage[];
    error?: string;
}

export default function TrafficDashboard() {
    const [data, setData] = useState<TrafficData | null>(null);
    const [health, setHealth] = useState<{
        uptime?: { formatted: string };
        memory?: { heapUsed: number; heapTotal: number; percentage: number; rss: number };
        node?: string;
        platform?: string;
        status?: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'7d' | '30d'>('7d');
    const [lastUpdated, setLastUpdated] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const [trackRes, healthRes] = await Promise.all([
                fetch(`/api/track?period=${period}`),
                fetch('/api/system-health'),
            ]);
            const [trackJson, healthJson] = await Promise.all([
                trackRes.json(),
                healthRes.json(),
            ]);
            setData(trackJson);
            setHealth(healthJson);
            setLastUpdated(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        } catch {
            setData(null);
            setHealth(null);
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => {
        setLoading(true);
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const maxPV = Math.max(...(data?.daily?.map(d => d.pageviews) || [1]), 1);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Lưu lượng truy cập</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Theo dõi lượt xem và visitors trên website</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Period Toggle */}
                    <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <button
                            onClick={() => setPeriod('7d')}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors ${period === '7d'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-darkgray text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            7 ngày
                        </button>
                        <button
                            onClick={() => setPeriod('30d')}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors ${period === '30d'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-darkgray text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            30 ngày
                        </button>
                    </div>
                    {/* Refresh */}
                    <button
                        onClick={fetchData}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                    >
                        <Icon icon="solar:refresh-bold" height={16} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                </div>
            ) : data ? (
                <>
                    {/* System Status */}
                    <div className="bg-white dark:bg-darkgray rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                                    <Icon icon="solar:monitor-smartphone-bold-duotone" className="text-indigo-600 dark:text-indigo-400" height={16} />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Trạng thái hệ thống</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${health?.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-300'}`} />
                                <span className="text-xs text-gray-400">{health?.status === 'healthy' ? 'Healthy' : 'Checking...'}</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon icon="solar:clock-circle-bold-duotone" className="text-emerald-500" height={14} />
                                        <span className="text-[11px] text-gray-400 uppercase tracking-wider">Uptime</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{health?.uptime?.formatted || '—'}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon icon="solar:cpu-bolt-bold-duotone" className="text-blue-500" height={14} />
                                        <span className="text-[11px] text-gray-400 uppercase tracking-wider">Heap Memory</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {health?.memory ? `${health.memory.heapUsed}/${health.memory.heapTotal}MB` : '—'}
                                    </p>
                                    {health?.memory && (
                                        <div className="mt-1.5 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${health.memory.percentage > 80 ? 'bg-red-500' : health.memory.percentage > 60 ? 'bg-amber-500' : 'bg-blue-500'}`}
                                                style={{ width: `${health.memory.percentage}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon icon="solar:chart-square-bold-duotone" className="text-violet-500" height={14} />
                                        <span className="text-[11px] text-gray-400 uppercase tracking-wider">RSS</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{health?.memory ? `${health.memory.rss}MB` : '—'}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon icon="solar:code-circle-bold-duotone" className="text-gray-500" height={14} />
                                        <span className="text-[11px] text-gray-400 uppercase tracking-wider">Runtime</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{health?.node ? `Node ${health.node}` : '—'}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{health?.platform || ''}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1">Dịch vụ:</span>
                                {[
                                    { name: 'Server', ok: health?.status === 'healthy', icon: 'solar:server-bold-duotone' },
                                    { name: 'Database', ok: true, icon: 'solar:database-bold-duotone' },
                                    { name: 'CDN', ok: true, icon: 'solar:cloud-bold-duotone' },
                                    { name: 'SSL', ok: true, icon: 'solar:shield-check-bold-duotone' },
                                ].map(svc => (
                                    <div key={svc.name} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs font-medium text-gray-600 dark:text-gray-300">
                                        <span className={`w-1.5 h-1.5 rounded-full ${svc.ok ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                        <Icon icon={svc.icon} height={13} className="text-gray-400" />
                                        {svc.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        <StatCard
                            label="Đang online"
                            value={data.activeUsers}
                            icon="solar:users-group-rounded-bold-duotone"
                            color="text-emerald-600 dark:text-emerald-400"
                            bg="bg-emerald-50 dark:bg-emerald-500/10"
                            sub="5 phút gần đây"
                        />
                        <StatCard
                            label="Lượt xem hôm nay"
                            value={data.today.pageviews}
                            icon="solar:eye-bold-duotone"
                            color="text-blue-600 dark:text-blue-400"
                            bg="bg-blue-50 dark:bg-blue-500/10"
                            sub={`${data.today.visitors} visitors`}
                        />
                        <StatCard
                            label={`Lượt xem (${period === '7d' ? '7 ngày' : '30 ngày'})`}
                            value={data.week.pageviews}
                            icon="solar:chart-bold-duotone"
                            color="text-violet-600 dark:text-violet-400"
                            bg="bg-violet-50 dark:bg-violet-500/10"
                            sub={`${data.week.visitors} visitors`}
                        />
                        <StatCard
                            label="TB/ngày"
                            value={data.daily.length > 0 ? Math.round(data.week.pageviews / data.daily.length) : 0}
                            icon="solar:graph-up-bold-duotone"
                            color="text-amber-600 dark:text-amber-400"
                            bg="bg-amber-50 dark:bg-amber-500/10"
                            sub="Lượt xem trung bình"
                        />
                    </div>

                    {/* Traffic Chart */}
                    <div className="bg-white dark:bg-darkgray rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Biểu đồ lượt xem</h3>
                        </div>
                        <div className="p-6">
                            {data.daily.length > 0 ? (
                                <div className="space-y-3">
                                    {/* Legend */}
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <span className="w-3 h-3 rounded-sm bg-indigo-500" />
                                            Lượt xem
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                                            Visitors
                                        </div>
                                    </div>

                                    {/* Bar Chart */}
                                    <div className="flex items-end gap-1 h-48">
                                        {data.daily.map((day, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                                                {/* Tooltip */}
                                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                    <div className="font-medium mb-0.5">{day.date}</div>
                                                    <div>{day.pageviews} lượt xem</div>
                                                    <div>{day.visitors} visitors</div>
                                                </div>

                                                {/* Bars */}
                                                <div className="w-full flex gap-px h-40 items-end">
                                                    <div
                                                        className="flex-1 bg-indigo-500 rounded-t-sm transition-all hover:bg-indigo-600 min-h-[2px]"
                                                        style={{ height: `${(day.pageviews / maxPV) * 100}%` }}
                                                    />
                                                    <div
                                                        className="flex-1 bg-emerald-500 rounded-t-sm transition-all hover:bg-emerald-600 min-h-[2px]"
                                                        style={{ height: `${(day.visitors / maxPV) * 100}%` }}
                                                    />
                                                </div>

                                                {/* Label */}
                                                <span className="text-[9px] text-gray-400 mt-1">{day.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <Icon icon="solar:chart-line-duotone" height={40} className="mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">Chưa có dữ liệu</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Top Pages */}
                        <div className="bg-white dark:bg-darkgray rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Trang được xem nhiều nhất (hôm nay)</h3>
                            </div>
                            <div className="p-3">
                                {data.topPages.length > 0 ? data.topPages.map((page, i) => (
                                    <div key={page.path} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <span className="text-xs font-bold text-gray-400 w-5 text-center">{i + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate font-mono">
                                                {page.path}
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">
                                            {page.count}
                                        </span>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <p className="text-sm">Chưa có lượt xem hôm nay</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Daily Stats Table */}
                        <div className="bg-white dark:bg-darkgray rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Chi tiết theo ngày</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-700">
                                            <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Ngày</th>
                                            <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Lượt xem</th>
                                            <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Visitors</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.daily.map((day, i) => (
                                            <tr key={i} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="text-sm text-gray-700 dark:text-gray-300 px-6 py-2.5">{day.date}</td>
                                                <td className="text-sm text-right font-semibold text-gray-900 dark:text-white px-6 py-2.5 tabular-nums">{day.pageviews}</td>
                                                <td className="text-sm text-right text-gray-600 dark:text-gray-400 px-6 py-2.5 tabular-nums">{day.visitors}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Last updated */}
                    {lastUpdated && (
                        <div className="text-center text-[11px] text-gray-400">
                            Tự động cập nhật mỗi 30 giây · Lần cuối: {lastUpdated}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-16 text-gray-400">
                    <Icon icon="solar:danger-triangle-line-duotone" height={40} className="mx-auto mb-2" />
                    <p>Không thể tải dữ liệu</p>
                </div>
            )}
        </div>
    );
}

// ── Stat Card Component ──
function StatCard({ label, value, icon, color, bg, sub }: {
    label: string;
    value: number;
    icon: string;
    color: string;
    bg: string;
    sub: string;
}) {
    return (
        <div className="bg-white dark:bg-darkgray rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${bg} mb-4`}>
                <Icon icon={icon} className={color} height={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{value.toLocaleString('vi-VN')}</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </div>
    );
}
