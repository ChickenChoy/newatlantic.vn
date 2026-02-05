import { NextRequest, NextResponse } from 'next/server';
import { getGlobalPartnerRegions, getGlobalPartners, addGlobalPartnerRegion, updateGlobalPartnerRegion, deleteGlobalPartnerRegion, addGlobalPartner, updateGlobalPartner, deleteGlobalPartner } from '@/lib/db-supabase';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity-logs';
import { GlobalPartnerRegion, GlobalPartner } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách regions và partners
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'all';
        const regionId = searchParams.get('regionId');

        if (type === 'regions') {
            const regions = await getGlobalPartnerRegions();
            return NextResponse.json(regions);
        }

        if (type === 'partners') {
            const partners = await getGlobalPartners();
            if (regionId) {
                const filtered = partners.filter(p => p.regionId === regionId);
                return NextResponse.json(filtered);
            }
            return NextResponse.json(partners);
        }

        // Return all data
        const [regions, partners] = await Promise.all([
            getGlobalPartnerRegions(),
            getGlobalPartners(),
        ]);

        return NextResponse.json({ regions, partners });
    } catch (error) {
        console.error('Error fetching global partners:', error);
        return NextResponse.json({ error: 'Failed to fetch global partners' }, { status: 500 });
    }
}

// POST - Thêm region hoặc partner mới
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, ...data } = body;

        if (type === 'region') {
            const region: GlobalPartnerRegion = {
                id: data.id || `region-${Date.now()}`,
                name: data.name,
                nameVi: data.nameVi,
                order: data.order || 0,
                enabled: data.enabled !== false,
            };

            const success = await addGlobalPartnerRegion(region);

            if (success) {
                await logActivity({
                    action: 'create',
                    entity: 'global-partner',
                    entityId: region.id,
                    entityName: `Region: ${region.nameVi}`,
                });

                revalidatePath('/');
                revalidatePath('/gioi-thieu');
                return NextResponse.json(region, { status: 201 });
            }

            return NextResponse.json({ error: 'Failed to add region' }, { status: 500 });
        }

        if (type === 'partner') {
            const partner: GlobalPartner = {
                id: data.id || `partner-${Date.now()}`,
                regionId: data.regionId,
                name: data.name,
                country: data.country,
                logo: data.logo,
                url: data.url,
                order: data.order || 0,
                enabled: data.enabled !== false,
            };

            const success = await addGlobalPartner(partner);

            if (success) {
                await logActivity({
                    action: 'create',
                    entity: 'global-partner',
                    entityId: partner.id,
                    entityName: partner.name,
                });

                revalidatePath('/');
                revalidatePath('/gioi-thieu');
                return NextResponse.json(partner, { status: 201 });
            }

            return NextResponse.json({ error: 'Failed to add partner' }, { status: 500 });
        }

        return NextResponse.json({ error: 'Invalid type. Use "region" or "partner"' }, { status: 400 });
    } catch (error) {
        console.error('Error adding global partner data:', error);
        return NextResponse.json({ error: 'Failed to add data' }, { status: 500 });
    }
}

// PUT - Cập nhật region hoặc partner
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        if (type === 'region') {
            const success = await updateGlobalPartnerRegion(id, updates);

            if (success) {
                await logActivity({
                    action: 'update',
                    entity: 'global-partner',
                    entityId: id,
                    entityName: `Region: ${updates.nameVi || id}`,
                });

                revalidatePath('/');
                revalidatePath('/gioi-thieu');
                return NextResponse.json({ success: true });
            }

            return NextResponse.json({ error: 'Failed to update region' }, { status: 500 });
        }

        if (type === 'partner') {
            const success = await updateGlobalPartner(id, updates);

            if (success) {
                await logActivity({
                    action: 'update',
                    entity: 'global-partner',
                    entityId: id,
                    entityName: updates.name || id,
                });

                revalidatePath('/');
                revalidatePath('/gioi-thieu');
                return NextResponse.json({ success: true });
            }

            return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
        }

        return NextResponse.json({ error: 'Invalid type. Use "region" or "partner"' }, { status: 400 });
    } catch (error) {
        console.error('Error updating global partner data:', error);
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
}

// DELETE - Xóa region hoặc partner
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const id = searchParams.get('id');

        if (!id || !type) {
            return NextResponse.json({ error: 'ID and type are required' }, { status: 400 });
        }

        if (type === 'region') {
            const regions = await getGlobalPartnerRegions();
            const region = regions.find(r => r.id === id);

            const success = await deleteGlobalPartnerRegion(id);

            if (success) {
                await logActivity({
                    action: 'delete',
                    entity: 'global-partner',
                    entityId: id,
                    entityName: `Region: ${region?.nameVi || id}`,
                });

                revalidatePath('/');
                revalidatePath('/gioi-thieu');
                return NextResponse.json({ success: true });
            }

            return NextResponse.json({ error: 'Failed to delete region' }, { status: 500 });
        }

        if (type === 'partner') {
            const partners = await getGlobalPartners();
            const partner = partners.find(p => p.id === id);

            const success = await deleteGlobalPartner(id);

            if (success) {
                await logActivity({
                    action: 'delete',
                    entity: 'global-partner',
                    entityId: id,
                    entityName: partner?.name || id,
                });

                revalidatePath('/');
                revalidatePath('/gioi-thieu');
                return NextResponse.json({ success: true });
            }

            return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
        }

        return NextResponse.json({ error: 'Invalid type. Use "region" or "partner"' }, { status: 400 });
    } catch (error) {
        console.error('Error deleting global partner data:', error);
        return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
}
