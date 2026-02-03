import { NextRequest, NextResponse } from 'next/server';
import {
    getHolidayEffects,
    addHolidayEffect,
    updateHolidayEffect,
    deleteHolidayEffect
} from '@/lib/db-supabase';
import { logActivity } from '@/lib/activity-logs';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET: Lấy danh sách holiday effects
export async function GET() {
    try {
        const effects = await getHolidayEffects();
        return NextResponse.json(effects);
    } catch (error) {
        console.error('Error loading holiday effects:', error);
        return NextResponse.json({ error: 'Failed to load holiday effects' }, { status: 500 });
    }
}

// POST: Thêm mới holiday effect
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const newEffect: any = {
            id: Date.now().toString(),
            name: body.name,
            slug: body.slug,
            enabled: body.enabled ?? false,
            start_date: body.startDate || body.start_date,
            end_date: body.endDate || body.end_date,
            effect_types: body.effectTypes || body.effect_types || ['banner'],
            description: body.description || '',
            primary_color: body.primaryColor || body.primary_color || '#dc2626',
            secondary_color: body.secondaryColor || body.secondary_color || '#ffd700',
        };

        const success = await addHolidayEffect(newEffect);

        if (success) {
            await logActivity({
                action: 'create',
                entity: 'holiday-effect',
                entityId: newEffect.id,
                entityName: newEffect.name,
            });

            revalidatePath('/');
            return NextResponse.json(newEffect, { status: 201 });
        }

        return NextResponse.json({ error: 'Failed to create holiday effect' }, { status: 500 });
    } catch (error) {
        console.error('Error creating holiday effect:', error);
        return NextResponse.json({ error: 'Failed to create holiday effect' }, { status: 500 });
    }
}

// PUT: Cập nhật holiday effect
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const updates: any = {};
        if (body.name !== undefined) updates.name = body.name;
        if (body.slug !== undefined) updates.slug = body.slug;
        if (body.enabled !== undefined) updates.enabled = body.enabled;
        if (body.startDate !== undefined) updates.start_date = body.startDate;
        if (body.start_date !== undefined) updates.start_date = body.start_date;
        if (body.endDate !== undefined) updates.end_date = body.endDate;
        if (body.end_date !== undefined) updates.end_date = body.end_date;
        if (body.effectTypes !== undefined) updates.effect_types = body.effectTypes;
        if (body.effect_types !== undefined) updates.effect_types = body.effect_types;
        if (body.description !== undefined) updates.description = body.description;
        if (body.primaryColor !== undefined) updates.primary_color = body.primaryColor;
        if (body.primary_color !== undefined) updates.primary_color = body.primary_color;
        if (body.secondaryColor !== undefined) updates.secondary_color = body.secondaryColor;
        if (body.secondary_color !== undefined) updates.secondary_color = body.secondary_color;

        const success = await updateHolidayEffect(body.id, updates);

        if (success) {
            await logActivity({
                action: 'update',
                entity: 'holiday-effect',
                entityId: body.id,
                entityName: body.name,
            });

            revalidatePath('/');
            return NextResponse.json({ success: true, ...updates });
        }

        return NextResponse.json({ error: 'Holiday effect not found' }, { status: 404 });
    } catch (error) {
        console.error('Error updating holiday effect:', error);
        return NextResponse.json({ error: 'Failed to update holiday effect' }, { status: 500 });
    }
}

// DELETE: Xóa holiday effect
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const effects = await getHolidayEffects();
        const effect = effects.find((e: any) => e.id === id);

        const success = await deleteHolidayEffect(id);

        if (success) {
            await logActivity({
                action: 'delete',
                entity: 'holiday-effect',
                entityId: id,
                entityName: effect?.name,
            });

            revalidatePath('/');
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Holiday effect not found' }, { status: 404 });
    } catch (error) {
        console.error('Error deleting holiday effect:', error);
        return NextResponse.json({ error: 'Failed to delete holiday effect' }, { status: 500 });
    }
}
