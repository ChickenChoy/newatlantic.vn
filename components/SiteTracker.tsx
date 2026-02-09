'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Generate a persistent session ID per browser tab
function getSessionId(): string {
    if (typeof window === 'undefined') return '';
    let id = sessionStorage.getItem('_sid');
    if (!id) {
        id = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem('_sid', id);
    }
    return id;
}

export default function SiteTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Don't track admin pages
        if (pathname.startsWith('/admin')) return;

        const sessionId = getSessionId();
        // Send tracking ping
        fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: pathname, sessionId }),
        }).catch(() => { /* silently fail */ });
    }, [pathname]);

    return null; // This component renders nothing
}
