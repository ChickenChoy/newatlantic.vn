import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, saveSiteSettings } from '@/lib/db-supabase';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy site settings
export async function GET() {
  try {
    const settings = await getSiteSettings();
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
    const currentSettings = await getSiteSettings();

    const updatedSettings = {
      ...currentSettings,
      ...body,
      id: 'site-settings',
    };

    const success = await saveSiteSettings(updatedSettings);

    if (success) {
      await logActivity({
        action: 'update',
        entity: 'site-settings',
        entityName: 'Cài đặt website',
        details: 'Cập nhật thông tin website',
      });

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
