'use client';

import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Icon } from '@iconify/react';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface TrafficData {
    date: string;
    pageviews: number;
    visitors: number;
    sessions: number;
}

interface AnalyticsResponse {
    configured: boolean;
    simulated: boolean;
    error?: string;
    message?: string;
    data: {
        traffic: TrafficData[];
        totals: {
            pageviews: number;
            visitors: number;
            sessions: number;
        };
    };
}

export default function TrafficChart() {
    const [period, setPeriod] = useState<'7d' | '30d'>('7d');
    const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
    const [totals, setTotals] = useState({ pageviews: 0, visitors: 0, sessions: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isSimulated, setIsSimulated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/analytics?period=${period}`);
                const data: AnalyticsResponse = await res.json();

                setTrafficData(data.data.traffic);
                setTotals(data.data.totals);
                setIsSimulated(data.simulated);

                if (data.error) {
                    setError(data.message || data.error);
                }
            } catch (err) {
                setError('Không thể tải dữ liệu analytics');
                console.error('Failed to fetch analytics:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [period]);

    const chartData = {
        labels: trafficData.map(d => d.date),
        datasets: [
            {
                label: 'Lượt xem',
                data: trafficData.map(d => d.pageviews),
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: period === '7d' ? 4 : 2,
                pointHoverRadius: 6,
            },
            {
                label: 'Khách truy cập',
                data: trafficData.map(d => d.visitors),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: period === '7d' ? 4 : 2,
                pointHoverRadius: 6,
            },
            {
                label: 'Phiên',
                data: trafficData.map(d => d.sessions),
                borderColor: 'rgb(249, 115, 22)',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: period === '7d' ? 4 : 2,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    maxRotation: 0,
                    font: { size: 11 },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    font: { size: 11 },
                },
            },
        },
    };

    return (
        <div className="bg-white dark:bg-darkgray rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                        <Icon icon="solar:chart-2-line-duotone" className="text-indigo-600" height={22} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Thống kê Traffic</h3>
                            {isSimulated && (
                                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                    Dữ liệu mô phỏng
                                </span>
                            )}
                            {!isSimulated && !isLoading && (
                                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    Dữ liệu thực
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {isSimulated ? 'Cần cấu hình GA4 để xem dữ liệu thực' : 'Google Analytics 4'}
                        </p>
                    </div>
                </div>

                {/* Period Toggle */}
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button
                        onClick={() => setPeriod('7d')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${period === '7d'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        7 ngày
                    </button>
                    <button
                        onClick={() => setPeriod('30d')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${period === '30d'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        30 ngày
                    </button>
                </div>
            </div>

            {/* Error message */}
            {error && isSimulated && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">{error}</p>
                </div>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {totals.pageviews.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Lượt xem trang</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {totals.visitors.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Khách truy cập</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {totals.sessions.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Phiên truy cập</div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[280px] relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <Line data={chartData} options={options} />
                )}
            </div>
        </div>
    );
}
