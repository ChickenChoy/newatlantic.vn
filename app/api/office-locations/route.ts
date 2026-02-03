import { NextRequest, NextResponse } from 'next/server';
import { getOfficeLocations, addOfficeLocation, updateOfficeLocation, deleteOfficeLocation } from '@/lib/db-supabase';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách office locations
export async function GET() {
  try {
    const locations = await getOfficeLocations();
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
    const { name, type, region, address, phone, email, googleMapsUrl, directionsUrl, order } = body;

    const newLocation: any = {
      id: String(Date.now()),
      name: name || 'Văn phòng mới',
      type: type || 'branch',
      region: region || '',
      address: address || '',
      phone: phone || '',
      email: email || '',
      google_maps_url: googleMapsUrl || '',
      directions_url: directionsUrl || '',
      order_index: order || 0,
      enabled: true,
    };

    const success = await addOfficeLocation(newLocation);

    if (success) {
      await logActivity({
        action: 'create',
        entity: 'office-location',
        entityId: newLocation.id,
        entityName: newLocation.name,
      });

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
    const { id, order, googleMapsUrl, directionsUrl, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }

    const locations = await getOfficeLocations();
    const location = locations.find(l => l.id === id);

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    const supabaseUpdates: any = { ...updates };
    if (order !== undefined) supabaseUpdates.order_index = order;
    if (googleMapsUrl !== undefined) supabaseUpdates.google_maps_url = googleMapsUrl;
    if (directionsUrl !== undefined) supabaseUpdates.directions_url = directionsUrl;

    const success = await updateOfficeLocation(id, supabaseUpdates);

    if (success) {
      await logActivity({
        action: 'update',
        entity: 'office-location',
        entityId: id,
        entityName: updates.name || location.name,
      });

      revalidatePath('/');
      revalidatePath('/lien-he');
      return NextResponse.json({ ...location, ...updates });
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

    const locations = await getOfficeLocations();
    const location = locations.find(l => l.id === id);

    const success = await deleteOfficeLocation(id);

    if (success) {
      await logActivity({
        action: 'delete',
        entity: 'office-location',
        entityId: id,
        entityName: location?.name,
      });

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
