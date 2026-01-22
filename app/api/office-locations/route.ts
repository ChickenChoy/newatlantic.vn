import { NextRequest, NextResponse } from 'next/server';
import { getOfficeLocations, saveOfficeLocations, addOfficeLocation, deleteOfficeLocation } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { OfficeLocation } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách office locations
export async function GET() {
  try {
    const locations = getOfficeLocations();
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching office locations:', error);
    return NextResponse.json({ error: 'Failed to fetch office locations' }, { status: 500 });
  }
}

// POST - Thêm office location mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, region, address, phone, email, googleMapsUrl, order } = body;

    if (!name || !address) {
      return NextResponse.json({ error: 'Name and address are required' }, { status: 400 });
    }

    const newLocation: OfficeLocation = {
      id: String(Date.now()),
      name,
      type: type || 'branch',
      region: region || '',
      address,
      phone: phone || '',
      email: email || '',
      googleMapsUrl: googleMapsUrl || '',
      order: order || 0,
    };

    const success = addOfficeLocation(newLocation);

    if (success) {
      revalidatePath('/');
      revalidatePath('/lien-he');
      return NextResponse.json(newLocation, { status: 201 });
    }

    return NextResponse.json({ error: 'Failed to add office location' }, { status: 500 });
  } catch (error) {
    console.error('Error adding office location:', error);
    return NextResponse.json({ error: 'Failed to add office location' }, { status: 500 });
  }
}

// PUT - Cập nhật office location
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }

    const locations = getOfficeLocations();
    const index = locations.findIndex(l => l.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    locations[index] = { ...locations[index], ...updates };
    const success = saveOfficeLocations(locations);

    if (success) {
      revalidatePath('/');
      revalidatePath('/lien-he');
      return NextResponse.json(locations[index]);
    }

    return NextResponse.json({ error: 'Failed to update office location' }, { status: 500 });
  } catch (error) {
    console.error('Error updating office location:', error);
    return NextResponse.json({ error: 'Failed to update office location' }, { status: 500 });
  }
}

// DELETE - Xóa office location
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }

    const success = deleteOfficeLocation(id);

    if (success) {
      revalidatePath('/');
      revalidatePath('/lien-he');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete office location' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting office location:', error);
    return NextResponse.json({ error: 'Failed to delete office location' }, { status: 500 });
  }
}
