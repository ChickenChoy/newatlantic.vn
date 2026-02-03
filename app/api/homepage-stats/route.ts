import { NextRequest, NextResponse } from 'next/server';
import { getHomepageStats, saveHomepageStats } from '@/lib/db-supabase';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách homepage stats
export async function GET() {
  try {
    const stats = await getHomepageStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching homepage stats:', error);
    return NextResponse.json({ error: 'Failed to fetch homepage stats' }, { status: 500 });
  }
}

// PUT - Cập nhật tất cả homepage stats
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Stats must be an array' }, { status: 400 });
    }

    const stats = body.map((stat, index) => ({
      id: stat.id || String(Date.now() + index),
      label: stat.label || '',
      value: stat.value || '0',
      suffix: stat.suffix || '',
      icon: stat.icon || '',
      order_index: stat.order ?? stat.order_index ?? index,
      enabled: stat.enabled !== false,
    }));

    const success = await saveHomepageStats(stats as any);

    if (success) {
      revalidatePath('/');
      return NextResponse.json(stats);
    }

    return NextResponse.json({ error: 'Failed to update homepage stats' }, { status: 500 });
  } catch (error) {
    console.error('Error updating homepage stats:', error);
    return NextResponse.json({ error: 'Failed to update homepage stats' }, { status: 500 });
  }
}
