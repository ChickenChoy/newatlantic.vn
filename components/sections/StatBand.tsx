'use client';

import CountUp from '../motion/CountUp';
import StaggerGroup from '../motion/StaggerGroup';

export interface StatItem {
  id: string;
  label: string;
  /** CMS value, e.g. "22", "1000" or "22+". Non-numeric values render verbatim. */
  value: string;
  suffix?: string;
}

export interface StatBandProps {
  stats: StatItem[];
  onDark?: boolean;
  /** Drop the dividers when the band sits inside another bordered block. */
  bare?: boolean;
  className?: string;
}

/**
 * Splits a CMS stat value into the number to count up to and whatever trails
 * it, so "22+" animates to 22 and keeps its plus sign.
 */
function parseValue(value: string, suffix?: string) {
  const match = value.match(/^\s*([\d.,]+)\s*(.*)$/);
  if (!match) return { numeric: null as number | null, tail: suffix ?? '' };

  const numeric = Number(match[1].replace(/[.,]/g, ''));
  if (Number.isNaN(numeric)) return { numeric: null, tail: suffix ?? '' };

  return { numeric, tail: suffix ?? match[2] ?? '' };
}

/**
 * The template's "fun fact" row: a handful of oversized display numbers that
 * count up the first time the band scrolls into view.
 *
 * Sized against its own container, not the viewport. `grid-cols-4` uses
 * `minmax(0, 1fr)` tracks, which let a track shrink below its content — so when
 * this band was dropped into the homepage's half-width About column (≈570px),
 * four 76px numbers needed ~215px each in 118px cells and "1.000+" ran straight
 * over "20+". A container query keeps the band 2-up until it genuinely has room
 * for four, and steps the numeral down a display size while it is narrow.
 */
export default function StatBand({ stats, onDark = false, bare = false, className = '' }: StatBandProps) {
  if (stats.length === 0) return null;

  return (
    <div className="@container">
      <StaggerGroup
        className={`grid grid-cols-2 gap-x-6 gap-y-8 @3xl:grid-cols-4 @3xl:gap-x-8 ${className}`}
      >
        {stats.map(stat => {
          const { numeric, tail } = parseValue(stat.value, stat.suffix);

          return (
            <div
              key={stat.id}
              className={
                bare
                  ? 'min-w-0'
                  : `min-w-0 border-t pt-5 ${onDark ? 'border-white/14' : 'border-navy/14'}`
              }
            >
              <div
                className={`font-display text-d4 leading-none tracking-display tabular-nums @3xl:text-d3 ${
                  onDark ? 'text-white' : 'text-navy'
                }`}
              >
                {numeric === null ? (
                  <span>{stat.value}</span>
                ) : (
                  <CountUp end={numeric} suffix={tail} duration={1600} />
                )}
              </div>
              <div
                className={`mt-3 text-xs uppercase leading-[1.5] tracking-[0.14em] @3xl:text-sm ${
                  onDark ? 'text-white/60' : 'text-muted'
                }`}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </StaggerGroup>
    </div>
  );
}
