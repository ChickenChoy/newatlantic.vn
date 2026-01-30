'use server';

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { HolidayEffect } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const HOLIDAY_EFFECTS_FILE = path.join(DATA_DIR, 'holiday-effects.json');

// Default Vietnamese holiday effects
// Theo Bộ luật Lao động 2019 - Điều 112
const DEFAULT_HOLIDAY_EFFECTS: HolidayEffect[] = [
    // ===== NGÀY LỄ CHÍNH THỨC (Theo Bộ luật Lao động) =====
    {
        id: '1',
        name: 'TẾT Dương Lịch',
        slug: 'tet-duong-lich',
        enabled: false,
        startDate: '12-30',
        endDate: '01-02',
        effectTypes: ['banner', 'fireworks'],
        description: 'Chào mừng năm mới Dương lịch (1/1)',
        primaryColor: '#3b82f6',
        secondaryColor: '#fbbf24',
    },
    {
        id: '2',
        name: 'TẾT Nguyên Đán',
        slug: 'tet-nguyen-dan',
        enabled: true,
        startDate: '01-15',  // Bắt đầu trước TẾT ~2 tuần
        endDate: '02-15',    // Kết thúc sau TẾT ~2 tuần
        effectTypes: ['banner', 'flowers', 'fireworks'],
        description: 'TẾT Âm lịch - 5 ngày nghỉ chính thức (29 Chạp - Mùng 5 Giêng)',
        primaryColor: '#dc2626',
        secondaryColor: '#ffd700',
    },
    {
        id: '3',
        name: 'Giỗ Tổ Hùng Vương',
        slug: 'gio-to-hung-vuong',
        enabled: false,
        startDate: '04-05',  // Thường rơi vào đầu tháng 4
        endDate: '04-10',    // 10/3 Âm lịch (dao động 04-05 đến 04-25 tùy năm)
        effectTypes: ['banner', 'fireworks', 'flags'],
        description: 'Ngày Giỗ Tổ Hùng Vương - 10/3 Âm lịch (1 ngày nghỉ)',
        primaryColor: '#b91c1c',
        secondaryColor: '#fcd34d',
    },
    {
        id: '4',
        name: 'Ngày Giải Phóng Miền Nam',
        slug: 'giai-phong-mien-nam',
        enabled: false,
        startDate: '04-28',
        endDate: '04-30',
        effectTypes: ['banner', 'fireworks', 'flags'],
        description: 'Ngày Giải phóng miền Nam 30/4 (1 ngày nghỉ)',
        primaryColor: '#dc2626',
        secondaryColor: '#fbbf24',
    },
    {
        id: '5',
        name: 'Ngày Quốc Tế Lao Động',
        slug: 'quoc-te-lao-dong',
        enabled: false,
        startDate: '05-01',
        endDate: '05-03',
        effectTypes: ['banner', 'fireworks'],
        description: 'Ngày Quốc tế Lao động 1/5 (1 ngày nghỉ)',
        primaryColor: '#dc2626',
        secondaryColor: '#fbbf24',
    },
    {
        id: '6',
        name: 'Quốc Khánh',
        slug: 'quoc-khanh',
        enabled: false,
        startDate: '09-01',
        endDate: '09-03',
        effectTypes: ['banner', 'flags', 'fireworks'],
        description: 'Ngày Quốc Khánh 2/9 (2 ngày nghỉ: 2/9 + 1 ngày liền kề)',
        primaryColor: '#dc2626',
        secondaryColor: '#fbbf24',
    },
    // ===== NGÀY LỄ PHỔ BIẾN KHÁC =====
    {
        id: '7',
        name: 'Valentine',
        slug: 'valentine',
        enabled: false,
        startDate: '02-12',
        endDate: '02-15',
        effectTypes: ['banner', 'flowers'],
        description: 'Ngày lễ Tình nhân 14/2',
        primaryColor: '#ec4899',
        secondaryColor: '#f472b6',
    },
    {
        id: '8',
        name: 'TẾT Trung Thu',
        slug: 'tet-trung-thu',
        enabled: false,
        startDate: '09-10',  // Rằm tháng 8 Âm lịch (dao động giữa 09 và 10)
        endDate: '09-20',
        effectTypes: ['banner', 'flowers'],
        description: 'TẾT Trung Thu - Rằm tháng 8 Âm lịch',
        primaryColor: '#f59e0b',
        secondaryColor: '#fbbf24',
    },
    {
        id: '9',
        name: 'Giáng Sinh',
        slug: 'giang-sinh',
        enabled: false,
        startDate: '12-20',
        endDate: '12-26',
        effectTypes: ['banner', 'snow'],
        description: 'Lễ Giáng sinh 25/12',
        primaryColor: '#16a34a',
        secondaryColor: '#dc2626',
    },
];

// Ensure data directory exists
function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

// Load holiday effects from file
function loadHolidayEffects(): HolidayEffect[] {
    ensureDataDir();
    if (!fs.existsSync(HOLIDAY_EFFECTS_FILE)) {
        fs.writeFileSync(HOLIDAY_EFFECTS_FILE, JSON.stringify(DEFAULT_HOLIDAY_EFFECTS, null, 2));
        return DEFAULT_HOLIDAY_EFFECTS;
    }
    try {
        const data = fs.readFileSync(HOLIDAY_EFFECTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return DEFAULT_HOLIDAY_EFFECTS;
    }
}

// Save holiday effects to file
function saveHolidayEffects(effects: HolidayEffect[]) {
    ensureDataDir();
    fs.writeFileSync(HOLIDAY_EFFECTS_FILE, JSON.stringify(effects, null, 2));
}

// GET: Lấy danh sách holiday effects
export async function GET() {
    try {
        const effects = loadHolidayEffects();
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
        const effects = loadHolidayEffects();

        const newEffect: HolidayEffect = {
            id: Date.now().toString(),
            name: body.name,
            slug: body.slug,
            enabled: body.enabled ?? false,
            startDate: body.startDate,
            endDate: body.endDate,
            effectTypes: body.effectTypes || ['banner'],
            description: body.description || '',
            primaryColor: body.primaryColor || '#dc2626',
            secondaryColor: body.secondaryColor || '#ffd700',
        };

        effects.push(newEffect);
        saveHolidayEffects(effects);

        return NextResponse.json(newEffect, { status: 201 });
    } catch (error) {
        console.error('Error creating holiday effect:', error);
        return NextResponse.json({ error: 'Failed to create holiday effect' }, { status: 500 });
    }
}

// PUT: Cập nhật holiday effect
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const effects = loadHolidayEffects();

        const index = effects.findIndex(e => e.id === body.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Holiday effect not found' }, { status: 404 });
        }

        effects[index] = {
            ...effects[index],
            ...body,
        };

        saveHolidayEffects(effects);

        return NextResponse.json(effects[index]);
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

        const effects = loadHolidayEffects();
        const filteredEffects = effects.filter(e => e.id !== id);

        if (filteredEffects.length === effects.length) {
            return NextResponse.json({ error: 'Holiday effect not found' }, { status: 404 });
        }

        saveHolidayEffects(filteredEffects);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting holiday effect:', error);
        return NextResponse.json({ error: 'Failed to delete holiday effect' }, { status: 500 });
    }
}
