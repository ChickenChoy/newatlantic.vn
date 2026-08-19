'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface Region {
    id: string;
    name: string;
    nameVi: string;
    partners: string[];
    /** Silhouette, drawn in the 700×350 viewBox. */
    path: string;
    /** Node point: where the region's route leaves and its label sits. */
    x: number;
    y: number;
}

/** The Vietnam hub every route converges on. */
const HUB_ID = 'southeast-asia';

const REGIONS: Region[] = [
    {
        id: 'north-america',
        name: 'North America',
        nameVi: 'Bắc Mỹ',
        partners: ['WILL-BURT (USA)', 'Moffett (USA)'],
        path: 'M 50 80 L 180 80 L 200 120 L 180 180 L 120 200 L 80 180 L 40 140 Z',
        x: 120,
        y: 130,
    },
    {
        id: 'europe',
        name: 'Europe',
        nameVi: 'Châu Âu',
        partners: ['HIAB (Sweden)', 'EFFER (Italy)', 'Clark Masts (UK)'],
        path: 'M 280 60 L 380 50 L 400 80 L 420 120 L 380 140 L 320 150 L 280 130 L 260 100 Z',
        x: 340,
        y: 100,
    },
    {
        id: 'middle-east',
        name: 'Middle East',
        nameVi: 'Trung Đông',
        partners: ['Petronas'],
        path: 'M 384 152 L 440 142 L 476 162 L 466 198 L 420 208 L 384 190 Z',
        x: 425,
        y: 175,
    },
    {
        id: 'asia',
        name: 'Asia',
        nameVi: 'Châu Á',
        partners: ['SKYMARK', 'LOVOL (China)', 'Eldis (Czech)', 'ST Airborne'],
        path: 'M 462 82 L 578 62 L 638 102 L 656 158 L 616 216 L 540 236 L 482 216 L 462 178 L 446 138 Z',
        x: 550,
        y: 150,
    },
    {
        id: HUB_ID,
        name: 'Southeast Asia',
        nameVi: 'Đông Nam Á',
        partners: ['NEW ATLANTIC (Việt Nam)'],
        path: 'M 524 246 L 600 234 L 638 262 L 618 306 L 560 312 L 522 282 Z',
        x: 570,
        y: 258,
    },
];

const HUB = REGIONS.find(r => r.id === HUB_ID)!;
const SPOKES = REGIONS.filter(r => r.id !== HUB_ID);
const PARTNER_COUNT = REGIONS.reduce((total, r) => total + r.partners.length, 0);

/**
 * A quadratic route from a region's node to the Vietnam hub. The control point
 * is lifted in proportion to the horizontal span, so a long haul (Bắc Mỹ) bows
 * like a great-circle track while a short one (Châu Á) stays almost straight.
 */
function route(from: Region): string {
    const mx = (from.x + HUB.x) / 2;
    const my = (from.y + HUB.y) / 2 - Math.abs(HUB.x - from.x) * 0.22 - 10;
    return `M ${from.x} ${from.y} Q ${mx} ${my} ${HUB.x} ${HUB.y}`;
}

function PartnerRows({ partners, compact = false }: { partners: string[]; compact?: boolean }) {
    return (
        <ul className={compact ? 'space-y-1.5' : 'grid gap-x-6 gap-y-1.5 sm:grid-cols-2'}>
            {partners.map(partner => (
                <li
                    key={partner}
                    className="flex items-center gap-2.5 border-b border-white/[0.08] py-1.5 text-sm text-white last:border-0"
                >
                    <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-pill bg-accent" />
                    {partner}
                </li>
            ))}
        </ul>
    );
}

export default function InteractivePartnerMap() {
    const [activeRegion, setActiveRegion] = useState<Region | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const reduceMotion = useReducedMotion();

    const handleRegionClick = (region: Region) => {
        setSelectedRegion(current => (current?.id === region.id ? null : region));
    };

    // The tooltip is anchored to the hovered region's own node rather than to a
    // fixed spot, then clamped so a rim region cannot push it out of the panel.
    const tooltipLeft = activeRegion
        ? Math.min(Math.max((activeRegion.x / 700) * 100, 15), 85)
        : 50;

    return (
        <div className="relative mx-auto w-full max-w-5xl">
            <div className="relative overflow-hidden rounded-card border border-white/14 bg-navy p-5 sm:p-7 md:p-9">
                {/* Depth, in three cheap layers instead of one flat gradient: a cool
                    highlight falling from the top-left, a warm accent bloom rising
                    behind the Vietnam hub, and a 1px specular edge along the top
                    that reads as a bevel and lifts the panel off the light section. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_120%_at_12%_0%,rgba(255,255,255,0.10),transparent_58%)]"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_85%_at_82%_92%,rgba(255,95,0,0.16),transparent_62%)]"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />

                <div className="relative">
                    {/* Header: title on the left, the network in numbers on the right. */}
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h3 className="font-display text-d5 uppercase leading-display tracking-display text-white">
                                Mạng lưới đối tác toàn cầu
                            </h3>
                        </div>

                        <div className="flex shrink-0 items-center gap-6">
                            <div>
                                <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                                    Khu vực
                                </span>
                                <span className="font-display mt-1.5 block text-d6 leading-none tracking-display tabular-nums text-white">
                                    {REGIONS.length}
                                </span>
                            </div>
                            <span aria-hidden="true" className="h-9 w-px bg-white/14" />
                            <div>
                                <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                                    Đối tác
                                </span>
                                <span className="font-display mt-1.5 block text-d6 leading-none tracking-display tabular-nums text-accent">
                                    {PARTNER_COUNT}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Map. The wrapper matches the SVG box exactly (viewBox 2:1,
                        width:100%, height:auto), so the tooltip can be placed in
                        percentages of the same coordinate space. */}
                    <div className="relative mt-7">
                        <svg
                            viewBox="0 0 700 350"
                            aria-hidden="true"
                            className="w-full touch-manipulation"
                        >
                            <defs>
                                {/* Halftone mesh, clipped to the region shapes. A stylised
                                    dot matrix reads as cartography; the old full-bleed
                                    square grid read as a spreadsheet behind the art. */}
                                <pattern id="pm-mesh" width="11" height="11" patternUnits="userSpaceOnUse">
                                    <rect width="11" height="11" fill="rgba(255,255,255,0.035)" />
                                    <circle cx="2" cy="2" r="1.05" fill="rgba(255,255,255,0.17)" />
                                </pattern>

                                <radialGradient id="pm-hub-glow">
                                    <stop offset="0%" stopColor="#ff5f00" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#ff5f00" stopOpacity="0" />
                                </radialGradient>

                                {/* One gradient per route, in user space, so every line
                                    fades from near-invisible at its origin to accent at the
                                    hub — direction of travel without an arrowhead. */}
                                {SPOKES.map(region => (
                                    <linearGradient
                                        key={region.id}
                                        id={`pm-route-${region.id}`}
                                        gradientUnits="userSpaceOnUse"
                                        x1={region.x}
                                        y1={region.y}
                                        x2={HUB.x}
                                        y2={HUB.y}
                                    >
                                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
                                        <stop offset="100%" stopColor="#ff5f00" stopOpacity="0.5" />
                                    </linearGradient>
                                ))}
                            </defs>

                            {/* Warm bloom under the hub, so the eye lands on Vietnam first. */}
                            <circle cx={HUB.x} cy={HUB.y} r="120" fill="url(#pm-hub-glow)" />

                            {/* Routes, behind the land masses. */}
                            <g fill="none" strokeLinecap="round">
                                {SPOKES.map(region => {
                                    const isActive =
                                        activeRegion?.id === region.id || selectedRegion?.id === region.id;
                                    const d = route(region);
                                    return (
                                        <g key={region.id}>
                                            <path
                                                d={d}
                                                stroke={`url(#pm-route-${region.id})`}
                                                strokeWidth={1.1}
                                                className="map-arc"
                                            />
                                            <path
                                                d={d}
                                                stroke="#ff5f00"
                                                strokeWidth={1.6}
                                                opacity={isActive ? 0.9 : 0}
                                                className="map-arc transition-opacity duration-300 ease-brand"
                                            />
                                        </g>
                                    );
                                })}
                            </g>

                            {/* Land masses. Rounded joins soften the polygon corners; the
                                accent wash is a separate path whose opacity can transition,
                                because a fill swapped between two patterns would snap. */}
                            {REGIONS.map(region => {
                                const isActive =
                                    activeRegion?.id === region.id || selectedRegion?.id === region.id;
                                return (
                                    <g
                                        key={region.id}
                                        className="map-region cursor-pointer"
                                        data-active={isActive}
                                        onMouseEnter={() => setActiveRegion(region)}
                                        onMouseLeave={() => setActiveRegion(null)}
                                        onClick={() => handleRegionClick(region)}
                                    >
                                        <path d={region.path} fill="url(#pm-mesh)" />
                                        <path
                                            d={region.path}
                                            className="fill-accent transition-opacity duration-300 ease-brand"
                                            opacity={isActive ? 0.16 : 0}
                                        />
                                        <path
                                            d={region.path}
                                            fill="none"
                                            strokeLinejoin="round"
                                            stroke={isActive ? '#ff5f00' : 'rgba(255,255,255,0.22)'}
                                            strokeWidth={isActive ? 1.75 : 1}
                                            className="transition-all duration-300 ease-brand"
                                        />
                                    </g>
                                );
                            })}

                            {/* Nodes and labels, above everything and never hit-tested. */}
                            <g className="pointer-events-none">
                                {SPOKES.map(region => {
                                    const isActive =
                                        activeRegion?.id === region.id || selectedRegion?.id === region.id;
                                    return (
                                        <circle
                                            key={region.id}
                                            cx={region.x}
                                            cy={region.y}
                                            r={isActive ? 3.6 : 2.6}
                                            fill={isActive ? '#ff5f00' : '#ffffff'}
                                            fillOpacity={isActive ? 1 : 0.55}
                                            className="transition-all duration-300 ease-brand"
                                        />
                                    );
                                })}

                                {/* Vietnam: a slow two-ring radar sweep instead of Tailwind's
                                    animate-ping, which doubles the radius on a hard ease and
                                    flickers. Long duration, wide travel, staggered start. */}
                                {[0, 1].map(index => (
                                    <motion.circle
                                        key={index}
                                        cx={HUB.x}
                                        cy={HUB.y}
                                        fill="none"
                                        stroke="#ff5f00"
                                        strokeWidth={1.4}
                                        initial={{ r: 6, opacity: 0.55 }}
                                        animate={reduceMotion ? { r: 6, opacity: 0.4 } : { r: [6, 36], opacity: [0.55, 0] }}
                                        transition={
                                            reduceMotion
                                                ? { duration: 0 }
                                                : { duration: 3.2, repeat: Infinity, ease: 'easeOut', delay: index * 1.6 }
                                        }
                                    />
                                ))}
                                <circle cx={HUB.x} cy={HUB.y} r="9" fill="none" stroke="#ff5f00" strokeOpacity="0.35" />
                                <circle cx={HUB.x} cy={HUB.y} r="4.6" fill="#ff5f00" />
                                <circle cx={HUB.x} cy={HUB.y} r="1.7" fill="#ffffff" fillOpacity="0.95" />

                                {/* Labels are hidden below sm: SVG font-size is in user units,
                                    so on a 340px-wide render a 13-unit label rasterises at
                                    about 6px. The chips below carry the names instead. */}
                                {REGIONS.map(region => (
                                    <text
                                        key={region.id}
                                        x={region.x}
                                        y={region.id === HUB_ID ? region.y + 30 : region.y - 15}
                                        textAnchor="middle"
                                        paintOrder="stroke"
                                        stroke="#0a2540"
                                        strokeWidth="3.5"
                                        strokeLinejoin="round"
                                        className={`max-sm:hidden select-none text-[16px] font-semibold uppercase tracking-[0.1em] sm:text-[14px] lg:text-[12px] ${
                                            activeRegion?.id === region.id || selectedRegion?.id === region.id
                                                ? 'fill-white'
                                                : 'fill-white/70'
                                        }`}
                                    >
                                        {region.nameVi}
                                    </text>
                                ))}
                            </g>
                        </svg>

                        {/* Hover card, glass over the navy map — the one place a backdrop
                            blur has something to blur. Desktop only; touch uses the panel. */}
                        {activeRegion && !selectedRegion && (
                            <div
                                className="pointer-events-none absolute z-20 hidden w-56 -translate-x-1/2 -translate-y-full rounded-card border border-white/14 bg-navy/80 p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur-md md:block"
                                style={{
                                    left: `${tooltipLeft}%`,
                                    top: `${(activeRegion.y / 350) * 100}%`,
                                    marginTop: '-16px',
                                }}
                            >
                                <span className="font-display block text-d6 uppercase leading-display tracking-display text-white">
                                    {activeRegion.nameVi}
                                </span>
                                <span className="mt-1.5 block text-[11px] uppercase tracking-[0.14em] text-white/50">
                                    {activeRegion.name}
                                </span>
                                <div className="mt-3 border-t border-white/14 pt-2">
                                    <PartnerRows partners={activeRegion.partners} compact />
                                </div>
                                <span
                                    aria-hidden="true"
                                    className="absolute -bottom-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-white/14 bg-navy/80"
                                />
                            </div>
                        )}
                    </div>

                    {/* Region chips double as the legend's interactive twin and as the
                        keyboard and touch entry point — real buttons, so focus order,
                        Enter/Space and aria-pressed all come for free. */}
                    <div className="mt-8 border-t border-white/14 pt-6">
                        <div className="flex flex-wrap gap-2">
                            {REGIONS.map(region => {
                                const isOn = selectedRegion?.id === region.id;
                                return (
                                    <button
                                        key={region.id}
                                        type="button"
                                        aria-pressed={isOn}
                                        onClick={() => handleRegionClick(region)}
                                        onMouseEnter={() => setActiveRegion(region)}
                                        onMouseLeave={() => setActiveRegion(null)}
                                        onFocus={() => setActiveRegion(region)}
                                        onBlur={() => setActiveRegion(null)}
                                        className={`inline-flex items-center gap-2 rounded-pill border px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ease-brand ${
                                            isOn
                                                ? 'border-accent bg-accent text-white'
                                                : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                                        }`}
                                    >
                                        {region.nameVi}
                                        <span className={`text-[10px] font-normal tabular-nums ${isOn ? 'text-white/80' : 'text-white/40'}`}>
                                            {region.partners.length}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                            <span className="flex items-center gap-2">
                                <span
                                    aria-hidden="true"
                                    className="h-2.5 w-2.5 border border-white/25 bg-white/10"
                                />
                                Khu vực đối tác
                            </span>
                            <span className="flex items-center gap-2">
                                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-pill bg-accent" />
                                Trung tâm Việt Nam
                            </span>
                            <span className="flex items-center gap-2">
                                <span
                                    aria-hidden="true"
                                    className="h-px w-6 bg-gradient-to-r from-white/20 to-accent"
                                />
                                Tuyến kết nối
                            </span>
                            <span className="text-white/35 md:hidden">Chọn khu vực để xem đối tác</span>
                        </div>
                    </div>

                    {/* Detail panel: the touch path, and the persistent view on desktop
                        once a region is pinned by a click. */}
                    <AnimatePresence initial={false}>
                        {selectedRegion && (
                            <motion.div
                                key={selectedRegion.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.28, ease: [0.44, 0, 0.56, 1] }}
                                aria-live="polite"
                                className="mt-6 rounded-card border border-white/14 bg-white/[0.06] p-5 backdrop-blur-md sm:p-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <span className="font-display block text-d6 uppercase leading-display tracking-display text-white">
                                            {selectedRegion.nameVi}
                                        </span>
                                        <span className="mt-2 block text-[11px] uppercase tracking-[0.16em] text-white/50">
                                            {selectedRegion.name} ·{' '}
                                            <span className="tabular-nums">{selectedRegion.partners.length}</span> đối tác
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRegion(null)}
                                        aria-label="Đóng"
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-white/20 text-white/70 transition-colors duration-300 ease-brand hover:border-white/50 hover:text-white"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-4 border-t border-white/14 pt-3">
                                    <PartnerRows partners={selectedRegion.partners} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* The full network in text, for assistive tech and for crawlers — the
                SVG itself is decorative and the panel is populated on demand. */}
            <dl className="sr-only">
                {REGIONS.map(region => (
                    <div key={region.id}>
                        <dt>
                            {region.nameVi} ({region.name})
                        </dt>
                        <dd>{region.partners.join(', ')}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
