'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

    // Handle click for mobile
    const handleRegionClick = (region: Region) => {
        if (selectedRegion?.id === region.id) {
            setSelectedRegion(null);
        } else {
            setSelectedRegion(region);
        }
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto px-2 sm:px-0">
            {/* Map Container */}
            <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-8 backdrop-blur-sm border border-gray-700/50">
                {/* Title */}
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white text-center mb-4 sm:mb-6">
                    Mạng lưới đối tác toàn cầu
                </h3>

                {/* SVG Map */}
                <svg
                    viewBox="0 0 700 350"
                    className="w-full h-auto touch-manipulation"
                    style={{ minHeight: '180px' }}
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
                    {regions.map((region) => {
                        const isActive = activeRegion?.id === region.id || selectedRegion?.id === region.id;
                        return (
                            <g key={region.id}>
                                <motion.path
                                    d={region.path}
                                    fill={isActive ? '#5f7ab8' : 'rgba(95, 122, 184, 0.3)'}
                                    stroke={isActive ? '#7a92c9' : 'rgba(95, 122, 184, 0.5)'}
                                    strokeWidth={isActive ? 2 : 1}
                                    className="cursor-pointer transition-colors duration-300"
                                    onMouseEnter={() => setActiveRegion(region)}
                                    onMouseLeave={() => setActiveRegion(null)}
                                    onClick={() => handleRegionClick(region)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    filter={isActive ? 'url(#glow)' : undefined}
                                />
                                {/* Region label - smaller on mobile */}
                                <text
                                    x={region.labelX}
                                    y={region.labelY}
                                    textAnchor="middle"
                                    className="text-[8px] sm:text-[10px] md:text-xs fill-white/80 font-medium pointer-events-none select-none"
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
                        );
                    })}

                    {/* Connection lines to Vietnam */}
                    <g className="opacity-30">
                        <line x1="120" y1="130" x2="570" y2="260" stroke="#5f7ab8" strokeWidth="1" strokeDasharray="4,4" />
                        <line x1="340" y1="100" x2="570" y2="260" stroke="#5f7ab8" strokeWidth="1" strokeDasharray="4,4" />
                        <line x1="425" y1="175" x2="570" y2="260" stroke="#5f7ab8" strokeWidth="1" strokeDasharray="4,4" />
                        <line x1="550" y1="150" x2="570" y2="260" stroke="#5f7ab8" strokeWidth="1" strokeDasharray="4,4" />
                    </g>
                </svg>

                {/* Mobile: Selected Region Info Card */}
                <AnimatePresence>
                    {selectedRegion && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="mt-4 bg-gray-900/95 backdrop-blur-md border border-gray-600/50 rounded-xl p-4 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-[#5f7ab8] rounded-full animate-pulse" />
                                    <h4 className="font-bold text-white text-base sm:text-lg">{selectedRegion.nameVi}</h4>
                                </div>
                                <button
                                    onClick={() => setSelectedRegion(null)}
                                    className="text-gray-400 hover:text-white p-1"
                                    aria-label="Close"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-gray-400 text-xs sm:text-sm mb-2">{selectedRegion.name}</p>
                            <div className="border-t border-gray-700 pt-2">
                                <p className="text-xs text-gray-500 mb-1">Đối tác:</p>
                                <ul className="space-y-1">
                                    {selectedRegion.partners.map((partner, idx) => (
                                        <li key={idx} className="text-xs sm:text-sm text-white flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-[#5f7ab8] rounded-full flex-shrink-0" />
                                            {partner}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Desktop Tooltip - hidden on mobile */}
                {activeRegion && !selectedRegion && (
                    <div className="hidden md:block absolute z-50 bg-gray-900/95 backdrop-blur-md border border-gray-600/50 rounded-xl p-4 shadow-2xl pointer-events-none"
                        style={{
                            left: '50%',
                            top: '10px',
                            transform: 'translateX(-50%)',
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
                    </div>
                )}

                {/* Legend - responsive */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#5f7ab8] rounded-full" />
                        <span className="text-gray-300">Khu vực đối tác</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-gray-300">NEW ATLANTIC VN</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-4 sm:w-6 border-t-2 border-dashed border-[#5f7ab8]/50" />
                        <span className="text-gray-300">Kết nối</span>
                    </div>
                </div>

                {/* Mobile hint */}
                <p className="text-center text-gray-500 text-xs mt-3 md:hidden">
                    Chạm vào khu vực để xem đối tác
                </p>
            </div>
        </div>
    );
}
