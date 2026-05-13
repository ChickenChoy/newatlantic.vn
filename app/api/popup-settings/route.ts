import { NextRequest, NextResponse } from 'next/server';
import { logActivity } from '@/lib/activity-logs';
import { revalidatePath } from 'next/cache';
import { getPopupSettings, savePopupSettings } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export interface PopupSettings {
    enabled: boolean;
    image: string;
    title: string;
    dismissHours: number;
    linkedHolidaySlug: string;  // e.g. "tet-nguyen-dan" — only show when this holiday is active
    delayMs: number;            // delay before showing popup
    maxWidth: number;           // max width in px
}

const DEFAULT_POPUP_SETTINGS: PopupSettings = {
    enabled: true,
    image: '/images/TB NGHI TET trang.png',
    title: 'Thông báo lịch nghỉ Tết Nguyên Đán',
    dismissHours: 24,
    linkedHolidaySlug: 'tet-nguyen-dan',
    delayMs: 1800,
    maxWidth: 360,
};

// GET - Lấy popup settings
export async function GET() {
    try {
        return NextResponse.json(getPopupSettings(DEFAULT_POPUP_SETTINGS));
    } catch (error) {
        console.error('Error fetching popup settings:', error);
        return NextResponse.json(DEFAULT_POPUP_SETTINGS);
    }
}

// PUT - Cập nhật popup settings
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        const settings: PopupSettings = {
            enabled: body.enabled ?? DEFAULT_POPUP_SETTINGS.enabled,
            image: body.image ?? DEFAULT_POPUP_SETTINGS.image,
            title: body.title ?? DEFAULT_POPUP_SETTINGS.title,
            dismissHours: body.dismissHours ?? DEFAULT_POPUP_SETTINGS.dismissHours,
            linkedHolidaySlug: body.linkedHolidaySlug ?? DEFAULT_POPUP_SETTINGS.linkedHolidaySlug,
            delayMs: body.delayMs ?? DEFAULT_POPUP_SETTINGS.delayMs,
            maxWidth: body.maxWidth ?? DEFAULT_POPUP_SETTINGS.maxWidth,
        };

        if (!savePopupSettings(settings)) {
            return NextResponse.json({ error: 'Failed to save popup settings' }, { status: 500 });
        }

        await logActivity({
            action: 'update',
            entity: 'site-settings',
            entityId: 'popup-settings',
            entityName: 'Cài đặt Popup thông báo',
        });

        revalidatePath('/');
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error saving popup settings:', error);
        return NextResponse.json({ error: 'Failed to save popup settings' }, { status: 500 });
    }
}
