import { NextRequest, NextResponse } from 'next/server';
import { getCertifications, saveCertifications, addCertification, deleteCertification } from '@/lib/db-supabase';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách certifications
export async function GET() {
    try {
        const certifications = await getCertifications();
        return NextResponse.json(certifications);
    } catch (error) {
        console.error('Error fetching certifications:', error);
        return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
    }
}

// POST - Thêm mới certification
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const newCertification: any = {
            id: Date.now().toString(),
            title: body.title || '',
            description: body.description || '',
            icon: body.icon || 'check-circle',
            image: body.image || '',
            enabled: body.enabled ?? true,
            order_index: body.order || 0,
        };

        const success = await addCertification(newCertification);

        if (success) {
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

        // Transform to snake_case
        const transformed = body.map(c => ({
            ...c,
            order_index: c.order ?? c.order_index ?? 0
        }));

        const success = await saveCertifications(transformed);

        if (success) {
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

        const certifications = await getCertifications();
        const certification = certifications.find(c => c.id === id);

        const success = await deleteCertification(id);

        if (success) {
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
