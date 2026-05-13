import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity-logs';
import { getNavbarSettings, saveNavbarSettings } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export interface NavItem {
    id: string;
    label: string;
    href: string;
    type: 'link' | 'dropdown' | 'button';
    target?: '_self' | '_blank';
    enabled: boolean;
    order: number;
    style?: 'default' | 'outline' | 'primary'; // for button type
    children?: NavItem[]; // for dropdown type
    showInMobile: boolean;
    showInDesktop: boolean;
}

export interface NavbarSettings {
    items: NavItem[];
    showSearch: boolean;
    showWishlist: boolean;
    showCatalogButton: boolean;
    showContactButton: boolean;
    catalogButtonText: string;
    catalogButtonUrl: string;
    contactButtonText: string;
    contactButtonUrl: string;
}

const DEFAULT_NAVBAR: NavbarSettings = {
    items: [
        { id: '1', label: 'Trang chủ', href: '/', type: 'link', enabled: true, order: 0, showInMobile: true, showInDesktop: true },
        { id: '2', label: 'Sản phẩm', href: '/san-pham', type: 'dropdown', enabled: true, order: 1, showInMobile: true, showInDesktop: true, children: [] },
        { id: '3', label: 'Tin tức', href: '/tin-tuc', type: 'link', enabled: true, order: 2, showInMobile: true, showInDesktop: true },
        { id: '4', label: 'Thư viện hình ảnh', href: '/thu-vien-hinh-anh', type: 'link', enabled: true, order: 3, showInMobile: true, showInDesktop: true },
    ],
    showSearch: true,
    showWishlist: true,
    showCatalogButton: true,
    showContactButton: true,
    catalogButtonText: 'Xem catalog',
    catalogButtonUrl: '/page-download-catalog',
    contactButtonText: 'Liên hệ',
    contactButtonUrl: '/lien-he',
};

// GET - Lấy navbar settings
export async function GET() {
    try {
        return NextResponse.json(getNavbarSettings(DEFAULT_NAVBAR));
    } catch (error) {
        console.error('Error fetching navbar settings:', error);
        return NextResponse.json(DEFAULT_NAVBAR);
    }
}

// PUT - Cập nhật navbar settings
export async function PUT(request: NextRequest) {
    try {
        const body: NavbarSettings = await request.json();

        if (!saveNavbarSettings(body)) {
            return NextResponse.json({ error: 'Failed to save navbar settings' }, { status: 500 });
        }

        await logActivity({
            action: 'update',
            entity: 'navbar-settings',
            entityName: 'Cài đặt thanh điều hướng',
            details: 'Cập nhật menu điều hướng website',
        });

        try {
            revalidatePath('/');
            revalidatePath('/san-pham');
            revalidatePath('/tin-tuc');
        } catch (e) {
            // Ignore revalidation errors
        }

        return NextResponse.json(body);
    } catch (error) {
        console.error('Error updating navbar settings:', error);
        return NextResponse.json({ error: 'Failed to update navbar settings' }, { status: 500 });
    }
}
