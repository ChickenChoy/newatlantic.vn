import { NextRequest, NextResponse } from "next/server";
import { getSEOSettings, saveSEOSettings } from '@/lib/db';
import { logActivity } from '@/lib/activity-logs';

// GET - Retrieve SEO settings
export async function GET() {
    try {
        const data = await getSEOSettings();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error reading SEO data:", error);
        return NextResponse.json({ error: "Failed to read SEO data" }, { status: 500 });
    }
}

// PUT - Update SEO settings
export async function PUT(request: NextRequest) {
    try {
        const updates = await request.json();
        const currentData = await getSEOSettings();

        // Deep merge updates
        const newData = {
            ...currentData,
            ...updates,
            global: { ...currentData.global, ...updates.global },
            pages: { ...currentData.pages, ...updates.pages },
            robots: { ...currentData.robots, ...updates.robots },
            sitemap: { ...currentData.sitemap, ...updates.sitemap },
            openGraph: { ...currentData.openGraph, ...updates.openGraph },
        };

        const success = await saveSEOSettings(newData);

        if (!success) {
            throw new Error('Failed to save SEO settings');
        }

        // Log activity
        await logActivity({
            action: 'update',
            entity: 'seo',
            entityName: 'Cài đặt SEO',
            details: 'Cập nhật cài đặt SEO toàn bộ',
        });

        return NextResponse.json({ success: true, data: newData });
    } catch (error) {
        console.error("Error updating SEO data:", error);
        return NextResponse.json({ error: "Failed to update SEO data" }, { status: 500 });
    }
}

// PATCH - Partial update (specific section)
export async function PATCH(request: NextRequest) {
    try {
        const { section, data } = await request.json();
        const currentData = await getSEOSettings();

        if (section === "global") {
            currentData.global = { ...currentData.global, ...data };
        } else if (section === "pages") {
            currentData.pages = { ...currentData.pages, ...data };
        } else if (section === "robots") {
            currentData.robots = { ...currentData.robots, ...data };
        } else if (section === "sitemap") {
            currentData.sitemap = { ...currentData.sitemap, ...data };
        } else if (section === "openGraph") {
            currentData.openGraph = { ...currentData.openGraph, ...data };
        } else {
            return NextResponse.json({ error: "Invalid section" }, { status: 400 });
        }

        const success = await saveSEOSettings(currentData);

        if (!success) {
            throw new Error('Failed to save SEO settings');
        }

        // Log activity
        await logActivity({
            action: 'update',
            entity: 'seo',
            entityName: section,
            details: `Cập nhật section ${section}`,
        });

        return NextResponse.json({ success: true, data: currentData });
    } catch (error) {
        console.error("Error patching SEO data:", error);
        return NextResponse.json({ error: "Failed to patch SEO data" }, { status: 500 });
    }
}
