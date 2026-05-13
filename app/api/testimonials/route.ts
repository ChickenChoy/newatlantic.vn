import { NextRequest, NextResponse } from 'next/server';
import { getTestimonials, saveTestimonials, addTestimonial, deleteTestimonial } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách testimonials
export async function GET() {
    try {
        const testimonials = await getTestimonials();
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

// POST - Thêm mới testimonial
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const newTestimonial: any = {
            id: Date.now().toString(),
            name: body.name || '',
            position: body.position || '',
            company: body.company || '',
            rating: body.rating || 5,
            text: body.text || '',
            image: body.image || '',
            enabled: body.enabled ?? true,
            order_index: body.order || 0,
        };

        const success = await addTestimonial(newTestimonial);

        if (success) {
            await logActivity({
                action: 'create',
                entity: 'testimonial',
                entityId: newTestimonial.id,
                entityName: newTestimonial.name,
            });

            revalidatePath('/');
            return NextResponse.json(newTestimonial, { status: 201 });
        }

        return NextResponse.json({ error: 'Failed to add testimonial' }, { status: 500 });
    } catch (error) {
        console.error('Error adding testimonial:', error);
        return NextResponse.json({ error: 'Failed to add testimonial' }, { status: 500 });
    }
}

// PUT - Cập nhật tất cả testimonials
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        if (!Array.isArray(body)) {
            return NextResponse.json({ error: 'Testimonials must be an array' }, { status: 400 });
        }

        // Transform to snake_case
        const transformed = body.map(t => ({
            ...t,
            order_index: t.order ?? t.order_index ?? 0
        }));

        const success = await saveTestimonials(transformed);

        if (success) {
            await logActivity({
                action: 'update',
                entity: 'testimonial',
                details: `Cập nhật ${body.length} đánh giá`,
            });

            revalidatePath('/');
            return NextResponse.json(body);
        }

        return NextResponse.json({ error: 'Failed to update testimonials' }, { status: 500 });
    } catch (error) {
        console.error('Error updating testimonials:', error);
        return NextResponse.json({ error: 'Failed to update testimonials' }, { status: 500 });
    }
}

// DELETE - Xóa testimonial
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const testimonials = await getTestimonials();
        const testimonial = testimonials.find(t => t.id === id);

        const success = await deleteTestimonial(id);

        if (success) {
            await logActivity({
                action: 'delete',
                entity: 'testimonial',
                entityId: id,
                entityName: testimonial?.name,
            });

            revalidatePath('/');
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
    }
}
