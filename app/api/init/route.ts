import { NextResponse } from 'next/server';
import { initializeDataIfNeeded } from '@/lib/db';

// Force Node.js runtime for fs operations
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST - Initialize data from lib/data.ts to JSON files
export async function POST() {
  try {
    await initializeDataIfNeeded();
    return NextResponse.json({ success: true, message: 'Data initialized successfully' });
  } catch (error) {
    console.error('Error initializing data:', error);
    return NextResponse.json({ error: 'Failed to initialize data' }, { status: 500 });
  }
}
