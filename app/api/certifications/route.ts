import { NextRequest, NextResponse } from 'next/server';
import { getCertifications, saveCertifications, addCertification, deleteCertification } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Certification } from '@/types';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách certifications
export async function GET() {
    try {
        const certifications = getCertifications();
        const sorted = certifications.sort((a, b) => a.order - b.order);
        return NextResponse.json(sorted);
    } catch (error) {
        console.error('Error fetching certifications:', error);
        return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
    }
}

// POST - Thêm mới certification
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const newCertification: Certification = {
            id: Date.now().toString(),
            title: body.title || '',
            description: body.description || '',
            icon: body.icon || 'check-circle',
            enabled: body.enabled ?? true,
            order: body.order || 1,
        };

        const success = addCertification(newCertification);

        if (success) {
            // Log activity
            await logActivity({
                action: 'create',
                entity: 'certification',
                entityId: newCertification.id,
                entityName: newCertification.title,
            });

            revalidatePath('/');
            return NextResponse.json(newCertification, { status: 201 });
        }

        return NextResponse.json({ error: 'Failed to add certification' }, { status: 500 });
    } catch (error) {
        console.error('Error adding certification:', error);
        return NextResponse.json({ error: 'Failed to add certification' }, { status: 500 });
    }
}

// PUT - Cập nhật tất cả certifications
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        if (!Array.isArray(body)) {
            return NextResponse.json({ error: 'Certifications must be an array' }, { status: 400 });
        }

        const success = saveCertifications(body);

        if (success) {
            // Log activity
            await logActivity({
                action: 'update',
                entity: 'certification',
                details: `Cập nhật ${body.length} chứng nhận`,
            });

            revalidatePath('/');
            return NextResponse.json(body);
        }

        return NextResponse.json({ error: 'Failed to update certifications' }, { status: 500 });
    } catch (error) {
        console.error('Error updating certifications:', error);
        return NextResponse.json({ error: 'Failed to update certifications' }, { status: 500 });
    }
}

// DELETE - Xóa certification
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const certifications = getCertifications();
        const certification = certifications.find(c => c.id === id);

        const success = deleteCertification(id);

        if (success) {
            // Log activity
            await logActivity({
                action: 'delete',
                entity: 'certification',
                entityId: id,
                entityName: certification?.title,
            });

            revalidatePath('/');
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    } catch (error) {
        console.error('Error deleting certification:', error);
        return NextResponse.json({ error: 'Failed to delete certification' }, { status: 500 });
    }
}
