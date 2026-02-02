import { NextRequest, NextResponse } from 'next/server';
import { getTestimonials, saveTestimonials, addTestimonial, deleteTestimonial } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Testimonial } from '@/types';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách testimonials
export async function GET() {
    try {
        const testimonials = getTestimonials();
        const sorted = testimonials.sort((a, b) => a.order - b.order);
        return NextResponse.json(sorted);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

// POST - Thêm mới testimonial
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const newTestimonial: Testimonial = {
            id: Date.now().toString(),
            name: body.name || '',
            position: body.position || '',
            rating: body.rating || 5,
            text: body.text || '',
            image: body.image || '',
            enabled: body.enabled ?? true,
            order: body.order || 1,
        };

        const success = addTestimonial(newTestimonial);

        if (success) {
            // Log activity
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

        const success = saveTestimonials(body);

        if (success) {
            // Log activity
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

        const testimonials = getTestimonials();
        const testimonial = testimonials.find(t => t.id === id);

        const success = deleteTestimonial(id);

        if (success) {
            // Log activity
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
