import { NextRequest, NextResponse } from 'next/server';
import { getHomepageStats, saveHomepageStats } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { HomepageStat } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách homepage stats
export async function GET() {
  try {
    const stats = getHomepageStats();
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

    const stats: HomepageStat[] = body.map((stat, index) => ({
      id: stat.id || String(Date.now() + index),
      label: stat.label || '',
      value: stat.value || '0',
      suffix: stat.suffix || '',
      order: stat.order || index + 1,
    }));

    const success = saveHomepageStats(stats);

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
