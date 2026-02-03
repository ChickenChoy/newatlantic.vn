import { NextResponse } from 'next/server';

// Force Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST - Initialize data (now using Supabase, no initialization needed)
export async function POST() {
  try {
    // With Supabase, data is already seeded via seed-supabase.ts
    // This endpoint is kept for backward compatibility
    return NextResponse.json({
      success: true,
      message: 'Using Supabase - data already seeded via npm run seed:supabase'
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}
