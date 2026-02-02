'use client';

import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Icon } from '@iconify/react';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface BrowserData {
    browser: string;
    percentage: number;
    users: number;
}

const browserColors: Record<string, string> = {
    'Chrome': 'rgb(66, 133, 244)',
    'Safari': 'rgb(0, 122, 255)',
    'Firefox': 'rgb(255, 149, 0)',
    'Edge': 'rgb(0, 120, 212)',
    'Opera': 'rgb(255, 0, 0)',
    'Samsung Internet': 'rgb(80, 80, 80)',
    'Other': 'rgb(156, 163, 175)',
};

const browserIcons: Record<string, string> = {
    'Chrome': 'logos:chrome',
    'Safari': 'logos:safari',
    'Firefox': 'logos:firefox',
    'Edge': 'logos:microsoft-edge',
    'Opera': 'logos:opera',
    'Samsung Internet': 'solar:global-line-duotone',
    'Other': 'solar:global-line-duotone',
};

export default function BrowserPieChart() {
    const [browserData, setBrowserData] = useState<BrowserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSimulated, setIsSimulated] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/analytics?period=7d');
                const data = await res.json();

                setBrowserData(data.data.browsers || []);
                setIsSimulated(data.simulated);
            } catch (err) {
                console.error('Failed to fetch browser data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const chartData = {
        labels: browserData.map(d => d.browser),
        datasets: [
            {
                data: browserData.map(d => d.percentage),
                backgroundColor: browserData.map(d => browserColors[d.browser] || browserColors['Other']),
                borderColor: browserData.map(d => (browserColors[d.browser] || browserColors['Other']).replace('rgb', 'rgba').replace(')', ', 0.8)')),
                borderWidth: 2,
                hoverOffset: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
                cornerRadius: 8,
                callbacks: {
                    label: (context: { parsed: number; label: string }) => {
                        return `${context.label}: ${context.parsed}%`;
                    },
                },
            },
        },
    };

    const totalUsers = browserData.reduce((sum, d) => sum + d.users, 0);

    return (
        <div className="bg-white dark:bg-darkgray rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Icon icon="solar:global-line-duotone" className="text-blue-600" height={22} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Trình duyệt</h3>
                        {isSimulated && !isLoading && (
                            <span className="px-1.5 py-0.5 text-[9px] font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                Mô phỏng
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phân bố theo browser</p>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[160px] relative mb-4">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <Doughnut data={chartData} options={options} />
                        {/* Center text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <div className="text-xl font-bold text-gray-900 dark:text-white">
                                    {totalUsers.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">người dùng</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Legend */}
            <div className="space-y-2">
                {browserData.slice(0, 4).map((browser) => (
                    <div key={browser.browser} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: browserColors[browser.browser] || browserColors['Other'] }}
                            />
                            <Icon icon={browserIcons[browser.browser] || browserIcons['Other']} height={16} />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{browser.browser}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {browser.percentage}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
