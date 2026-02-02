import { NextRequest, NextResponse } from 'next/server';
import { getHomepageServices, saveHomepageServices, addHomepageService, updateHomepageService, deleteHomepageService } from '@/lib/db';
import { HomepageService } from '@/types';

// GET - Lấy danh sách dịch vụ trang chủ
export async function GET() {
    try {
        const services = getHomepageServices();
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

        const newService: HomepageService = {
            id: `service-${Date.now()}`,
            title: data.title || '',
            description: data.description || '',
            color: data.color || '#5f7ab8',
            order: data.order ?? 0,
            enabled: data.enabled ?? true,
        };

        const success = addHomepageService(newService);
        if (success) {
            return NextResponse.json(newService, { status: 201 });
        } else {
            return NextResponse.json({ error: 'Failed to add service' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error adding homepage service:', error);
        return NextResponse.json({ error: 'Failed to add service' }, { status: 500 });
    }
}

// PUT - Cập nhật dịch vụ
export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        const { id, ...updates } = data;

        if (!id) {
            return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
        }

        const success = updateHomepageService(id, updates);
        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }
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

        const success = deleteHomepageService(id);
        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error deleting homepage service:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
