import { NextRequest, NextResponse } from 'next/server';
import { getFAQs, saveFAQs, addFAQ, deleteFAQ } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { FAQ } from '@/types';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách FAQs
export async function GET() {
    try {
        const faqs = getFAQs();
        const sorted = faqs.sort((a, b) => a.order - b.order);
        return NextResponse.json(sorted);
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
    }
}

// POST - Thêm mới FAQ
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const newFAQ: FAQ = {
            id: Date.now().toString(),
            question: body.question || '',
            answer: body.answer || '',
            enabled: body.enabled ?? true,
            order: body.order || 1,
        };

        const success = addFAQ(newFAQ);

        if (success) {
            // Log activity
            await logActivity({
                action: 'create',
                entity: 'faq',
                entityId: newFAQ.id,
                entityName: newFAQ.question.substring(0, 50),
            });

            revalidatePath('/');
            return NextResponse.json(newFAQ, { status: 201 });
        }

        return NextResponse.json({ error: 'Failed to add FAQ' }, { status: 500 });
    } catch (error) {
        console.error('Error adding FAQ:', error);
        return NextResponse.json({ error: 'Failed to add FAQ' }, { status: 500 });
    }
}

// PUT - Cập nhật tất cả FAQs
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        if (!Array.isArray(body)) {
            return NextResponse.json({ error: 'FAQs must be an array' }, { status: 400 });
        }

        const success = saveFAQs(body);

        if (success) {
            // Log activity
            await logActivity({
                action: 'update',
                entity: 'faq',
                details: `Cập nhật ${body.length} FAQ`,
            });

            revalidatePath('/');
            return NextResponse.json(body);
        }

        return NextResponse.json({ error: 'Failed to update FAQs' }, { status: 500 });
    } catch (error) {
        console.error('Error updating FAQs:', error);
        return NextResponse.json({ error: 'Failed to update FAQs' }, { status: 500 });
    }
}

// DELETE - Xóa FAQ
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const faqs = getFAQs();
        const faq = faqs.find(f => f.id === id);

        const success = deleteFAQ(id);

        if (success) {
            // Log activity
            await logActivity({
                action: 'delete',
                entity: 'faq',
                entityId: id,
                entityName: faq?.question.substring(0, 50),
            });

            revalidatePath('/');
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
    }
}
