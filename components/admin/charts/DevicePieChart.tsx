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

interface DeviceData {
    device: string;
    percentage: number;
    sessions: number;
}

const deviceColors: Record<string, string> = {
    'Desktop': 'rgb(99, 102, 241)',
    'Mobile': 'rgb(34, 197, 94)',
    'Tablet': 'rgb(249, 115, 22)',
};

const deviceIcons: Record<string, string> = {
    'Desktop': 'solar:monitor-line-duotone',
    'Mobile': 'solar:smartphone-line-duotone',
    'Tablet': 'solar:tablet-line-duotone',
};

export default function DevicePieChart() {
    const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSimulated, setIsSimulated] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/analytics?period=7d');
                const data = await res.json();

                setDeviceData(data.data.devices || []);
                setIsSimulated(data.simulated);
            } catch (err) {
                console.error('Failed to fetch device data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const chartData = {
        labels: deviceData.map(d => d.device),
        datasets: [
            {
                data: deviceData.map(d => d.percentage),
                backgroundColor: deviceData.map(d => deviceColors[d.device] || 'rgb(156, 163, 175)'),
                borderColor: deviceData.map(d => (deviceColors[d.device] || 'rgb(156, 163, 175)').replace('rgb', 'rgba').replace(')', ', 0.8)')),
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

    const totalSessions = deviceData.reduce((sum, d) => sum + d.sessions, 0);

    return (
        <div className="bg-white dark:bg-darkgray rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                    <Icon icon="solar:devices-line-duotone" className="text-purple-600" height={22} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Thiết bị</h3>
                        {isSimulated && !isLoading && (
                            <span className="px-1.5 py-0.5 text-[9px] font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                Mô phỏng
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phân bố theo thiết bị</p>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[160px] relative mb-4">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : (
                    <>
                        <Doughnut data={chartData} options={options} />
                        {/* Center text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <div className="text-xl font-bold text-gray-900 dark:text-white">
                                    {totalSessions.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">phiên</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Legend */}
            <div className="space-y-2">
                {deviceData.map((device) => (
                    <div key={device.device} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: deviceColors[device.device] || 'rgb(156, 163, 175)' }}
                            />
                            <Icon icon={deviceIcons[device.device] || 'solar:devices-line-duotone'} height={16} className="text-gray-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{device.device}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {device.percentage}%
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({device.sessions.toLocaleString()})
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
