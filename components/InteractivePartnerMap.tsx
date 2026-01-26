'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Region {
    id: string;
    name: string;
    nameVi: string;
    partners: string[];
    path: string;
    labelX: number;
    labelY: number;
}

const regions: Region[] = [
    {
        id: 'north-america',
        name: 'North America',
        nameVi: 'Bắc Mỹ',
        partners: ['WILL-BURT (USA)', 'Moffett (USA)'],
        path: 'M 50 80 L 180 80 L 200 120 L 180 180 L 120 200 L 80 180 L 40 140 Z',
        labelX: 120,
        labelY: 130,
    },
    {
        id: 'europe',
        name: 'Europe',
        nameVi: 'Châu Âu',
        partners: ['HIAB (Sweden)', 'EFFER (Italy)', 'Clark Masts (UK)'],
        path: 'M 280 60 L 380 50 L 400 80 L 420 120 L 380 140 L 320 150 L 280 130 L 260 100 Z',
        labelX: 340,
        labelY: 100,
    },
    {
        id: 'middle-east',
        name: 'Middle East',
        nameVi: 'Trung Đông',
        partners: ['Petronas'],
        path: 'M 380 150 L 440 140 L 480 160 L 470 200 L 420 210 L 380 190 Z',
        labelX: 425,
        labelY: 175,
    },
    {
        id: 'asia',
        name: 'Asia',
        nameVi: 'Châu Á',
        partners: ['SKYMARK', 'LOVOL (China)', 'Eldis (Czech)', 'ST Airborne'],
        path: 'M 460 80 L 580 60 L 640 100 L 660 160 L 620 220 L 540 240 L 480 220 L 460 180 L 440 140 Z',
        labelX: 550,
        labelY: 150,
    },
    {
        id: 'southeast-asia',
        name: 'Southeast Asia',
        nameVi: 'Đông Nam Á',
        partners: ['NEW ATLANTIC (Vietnam) 🇻🇳'],
        path: 'M 520 220 L 600 210 L 640 250 L 620 300 L 560 310 L 520 280 Z',
        labelX: 570,
        labelY: 260,
    },
];

export default function InteractivePartnerMap() {
    const [activeRegion, setActiveRegion] = useState<Region | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top - 10,
        });
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Map Container */}
            <div
                className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-4 md:p-8 backdrop-blur-sm border border-gray-700/50"
                onMouseMove={handleMouseMove}
            >
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-6">
                    🌍 Mạng lưới đối tác toàn cầu
                </h3>

                {/* SVG Map */}
                <svg
                    viewBox="0 0 700 350"
                    className="w-full h-auto"
                    style={{ minHeight: '250px' }}
                >
                    {/* Background grid */}
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                        </pattern>
                        {/* Glow filter */}
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Regions */}
                    {regions.map((region) => (
                        <g key={region.id}>
                            <motion.path
                                d={region.path}
                                fill={activeRegion?.id === region.id ? '#5f7ab8' : 'rgba(95, 122, 184, 0.3)'}
                                stroke={activeRegion?.id === region.id ? '#7a92c9' : 'rgba(95, 122, 184, 0.5)'}
                                strokeWidth={activeRegion?.id === region.id ? 2 : 1}
                                className="cursor-pointer transition-colors duration-300"
                                onMouseEnter={() => setActiveRegion(region)}
                                onMouseLeave={() => setActiveRegion(null)}
                                whileHover={{ scale: 1.02 }}
                                filter={activeRegion?.id === region.id ? 'url(#glow)' : undefined}
                            />
                            {/* Region label */}
                            <text
                                x={region.labelX}
                                y={region.labelY}
                                textAnchor="middle"
                                className="text-[10px] md:text-xs fill-white/80 font-medium pointer-events-none select-none"
                            >
                                {region.nameVi}
                            </text>
                            {/* Pulse dot for Vietnam */}
                            {region.id === 'southeast-asia' && (
                                <>
                                    <circle cx={570} cy={265} r="4" fill="#ef4444" className="animate-ping" />
                                    <circle cx={570} cy={265} r="3" fill="#ef4444" />
                                </>
                            )}
                        </g>
                    ))}

                    {/* Connection lines to Vietnam */}
                    <g className="opacity-30">
                        <line x1="120" y1="130" x2="570" y2="260" stroke="#5f7ab8" strokeWidth="1" strokeDasharray="4,4" />
                        <line x1="340" y1="100" x2="570" y2="260" stroke="#5f7ab8" strokeWidth="1" strokeDasharray="4,4" />
                        <line x1="425" y1="175" x2="570" y2="260" stroke="#5f7ab8" strokeWidth="1" strokeDasharray="4,4" />
                        <line x1="550" y1="150" x2="570" y2="260" stroke="#5f7ab8" strokeWidth="1" strokeDasharray="4,4" />
                    </g>
                </svg>

                {/* Tooltip */}
                {activeRegion && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 bg-gray-900/95 backdrop-blur-md border border-gray-600/50 rounded-xl p-4 shadow-2xl pointer-events-none"
                        style={{
                            left: Math.min(tooltipPos.x, 400),
                            top: tooltipPos.y - 100,
                            minWidth: '200px',
                        }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-[#5f7ab8] rounded-full animate-pulse" />
                            <h4 className="font-bold text-white text-lg">{activeRegion.nameVi}</h4>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{activeRegion.name}</p>
                        <div className="border-t border-gray-700 pt-2">
                            <p className="text-xs text-gray-500 mb-1">Đối tác:</p>
                            <ul className="space-y-1">
                                {activeRegion.partners.map((partner, idx) => (
                                    <li key={idx} className="text-sm text-white flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#5f7ab8] rounded-full" />
                                        {partner}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#5f7ab8] rounded-full" />
                        <span className="text-gray-300">Khu vực đối tác</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-gray-300">NEW ATLANTIC Việt Nam</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 border-t-2 border-dashed border-[#5f7ab8]/50" />
                        <span className="text-gray-300">Kết nối</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
