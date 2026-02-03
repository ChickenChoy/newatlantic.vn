import { NextRequest, NextResponse } from 'next/server';
import { getHomepageServices, addHomepageService, updateHomepageService, deleteHomepageService } from '@/lib/db-supabase';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách dịch vụ trang chủ
export async function GET() {
    try {
        const services = await getHomepageServices();
        return NextResponse.json(services);
    } catch (error) {
        console.error('Error fetching homepage services:', error);
        return NextResponse.json({ error: 'Failed to fetch homepage services' }, { status: 500 });
    }
}

// POST - Thêm dịch vụ mới
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const newService: any = {
            id: `service-${Date.now()}`,
            title: data.title || '',
            description: data.description || '',
            icon: data.icon || '',
            color: data.color || '#5f7ab8',
            link: data.link || '',
            order_index: data.order ?? 0,
            enabled: data.enabled ?? true,
        };

        const success = await addHomepageService(newService);
        if (success) {
            await logActivity({
                action: 'create',
                entity: 'homepage-service',
                entityId: newService.id,
                entityName: newService.title,
            });

            return NextResponse.json(newService, { status: 201 });
        }

        return NextResponse.json({ error: 'Failed to add service' }, { status: 500 });
    } catch (error) {
        console.error('Error adding homepage service:', error);
        return NextResponse.json({ error: 'Failed to add service' }, { status: 500 });
    }
}

// PUT - Cập nhật dịch vụ
export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        const { id, order, ...updates } = data;

        if (!id) {
            return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
        }

        const services = await getHomepageServices();
        const service = services.find(s => s.id === id);

        const supabaseUpdates: any = { ...updates };
        if (order !== undefined) supabaseUpdates.order_index = order;

        const success = await updateHomepageService(id, supabaseUpdates);
        if (success) {
            await logActivity({
                action: 'update',
                entity: 'homepage-service',
                entityId: id,
                entityName: updates.title || service?.title,
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    } catch (error) {
        console.error('Error updating homepage service:', error);
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

// DELETE - Xóa dịch vụ
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
        }

        const services = await getHomepageServices();
        const service = services.find(s => s.id === id);

        const success = await deleteHomepageService(id);
        if (success) {
            await logActivity({
                action: 'delete',
                entity: 'homepage-service',
                entityId: id,
                entityName: service?.title,
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    } catch (error) {
        console.error('Error deleting homepage service:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
