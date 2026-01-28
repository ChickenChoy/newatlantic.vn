'use client';

import { useState, useEffect } from 'react';
import { HolidayEffect } from '@/types';

// Hook to get active holiday effects
export function useHolidayEffects() {
    const [effects, setEffects] = useState<HolidayEffect[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEffects = async () => {
            try {
                const response = await fetch('/api/holiday-effects');
                if (response.ok) {
                    const data = await response.json();
                    setEffects(data);
                } else {
                    setError('Failed to fetch holiday effects');
                }
            } catch (err) {
                console.error('Error fetching holiday effects:', err);
                setError('Failed to fetch holiday effects');
            } finally {
                setLoading(false);
            }
        };

        fetchEffects();
    }, []);

    // Check if a specific effect type is active for a given holiday
    const isEffectActive = (slug: string, effectType?: string): boolean => {
        const effect = effects.find(e => e.slug === slug && e.enabled);
        if (!effect) return false;

        if (effectType) {
            return effect.effectTypes.includes(effectType);
        }

        return true; // If no effect type specified, just check if enabled
    };

    // Get all active effects (enabled and within date range)
    const getActiveEffects = (): HolidayEffect[] => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // 1-12
        const currentDay = now.getDate();
        const currentDate = `${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`; // MM-DD

        return effects.filter(effect => {
            if (!effect.enabled) return false;

            // Check if current date is within the effect's date range
            // Note: This is a simple check that works for most cases
            // For effects that cross year boundary (e.g., 12-30 to 01-02), additional logic may be needed
            const start = effect.startDate;
            const end = effect.endDate;

            if (start <= end) {
                // Normal range within the same year
                return currentDate >= start && currentDate <= end;
            } else {
                // Range crosses year boundary (e.g., Dec to Jan)
                return currentDate >= start || currentDate <= end;
            }
        });
    };

    // Check if a specific effect type is currently active (any holiday)
    const hasActiveEffect = (effectType: string): boolean => {
        return getActiveEffects().some(e => e.effectTypes.includes(effectType));
    };

    // Check if Tet is active (special case for TetBanner)
    const isTetActive = (): boolean => {
        // First check if Tet effect is enabled
        const tetEffect = effects.find(e => e.slug === 'tet-nguyen-dan');
        if (!tetEffect?.enabled) return false;

        // Check if within date range
        const activeEffects = getActiveEffects();
        return activeEffects.some(e => e.slug === 'tet-nguyen-dan');
    };

    return {
        effects,
        loading,
        error,
        isEffectActive,
        getActiveEffects,
        hasActiveEffect,
        isTetActive,
    };
}
