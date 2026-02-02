import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, saveSiteSettings } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { SiteSettings } from '@/types';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy site settings
export async function GET() {
  try {
    const settings = getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 });
  }
}

// PUT - Cập nhật site settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const currentSettings = getSiteSettings();

    const updatedSettings: SiteSettings = {
      ...currentSettings,
      ...body,
      id: 'site-settings', // Always keep the same ID
    };

    const success = saveSiteSettings(updatedSettings);

    if (success) {
      // Log activity
      await logActivity({
        action: 'update',
        entity: 'site-settings',
        entityName: 'Cài đặt website',
        details: 'Cập nhật thông tin website',
      });

      // Revalidate all pages that use site settings
      revalidatePath('/');
      revalidatePath('/lien-he');

      return NextResponse.json(updatedSettings);
    }

    return NextResponse.json({ error: 'Failed to update site settings' }, { status: 500 });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json({ error: 'Failed to update site settings' }, { status: 500 });
  }
}
