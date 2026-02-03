import { NextRequest, NextResponse } from 'next/server';
import {
    getUsers,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    getUserStats,
    emailHasPermission,
    syncUserFromAuth,
    updateLastLogin
} from '@/lib/users';
import { createAdminClient } from '@/lib/supabase';
import { logActivity } from '@/lib/activity-logs';
import { AdminUser, UserRole } from '@/types';

// Helper to get current user from request (from cookies/session)
async function getCurrentUserEmail(request: NextRequest): Promise<string | null> {
    // Get user email from Supabase session cookie or header
    const authHeader = request.headers.get('x-user-email');
    if (authHeader) {
        return authHeader;
    }

    // Fallback: try to get from session cookie (simplified)
    // In production, you'd verify the Supabase JWT token
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
        // Parse sb-access-token or similar
        // For now, we'll rely on the x-user-email header set by the client
    }

    return null;
}

// GET - List all users or get current user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const email = searchParams.get('email');

        // Get current user by email
        if (action === 'me' && email) {
            let user = await getUserByEmail(email);
            if (!user) {
                // Sync from auth if user doesn't exist in DB
                try {
                    const syncedUser = await syncUserFromAuth(email);
                    return NextResponse.json({ user: syncedUser });
                } catch {
                    return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 });
                }
            }

            // Update last login time for existing user
            const updateLogin = searchParams.get('updateLogin');
            if (updateLogin === 'true') {
                const updatedUser = await updateLastLogin(user.id);
                if (updatedUser) {
                    user = updatedUser;
                }
            }

            return NextResponse.json({ user });
        }

        // Get user statistics
        if (action === 'stats') {
            const stats = await getUserStats();
            return NextResponse.json({ stats });
        }

        // Get single user by email
        if (email && action === 'check') {
            const user = await getUserByEmail(email);
            return NextResponse.json({ exists: !!user, user: user || null });
        }

        // List all users - requires manage_users permission
        const currentEmail = await getCurrentUserEmail(request);
        if (currentEmail) {
            const hasPermission = await emailHasPermission(currentEmail, 'manage_users');
            if (!hasPermission) {
                return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
            }
        }

        const users = await getUsers();
        const stats = await getUserStats();

        return NextResponse.json({
            users,
            stats,
            success: true
        });
    } catch (error) {
        console.error('Error getting users:', error);
        return NextResponse.json({ error: 'Lỗi khi lấy danh sách người dùng' }, { status: 500 });
    }
}

// POST - Create new user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, name, role, password, isActive = true, invitedBy } = body as {
            email: string;
            name: string;
            role: UserRole;
            password?: string;
            isActive?: boolean;
            invitedBy?: string;
        };

        // Validate required fields
        if (!email || !name || !role) {
            return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 });
        }

        // Validate role
        const validRoles: UserRole[] = ['super_admin', 'admin', 'editor', 'viewer'];
        if (!validRoles.includes(role)) {
            return NextResponse.json({ error: 'Role không hợp lệ' }, { status: 400 });
        }

        // Check permission - only super_admin can create users
        const currentEmail = await getCurrentUserEmail(request);
        if (currentEmail) {
            const hasPermission = await emailHasPermission(currentEmail, 'manage_users');
            if (!hasPermission) {
                return NextResponse.json({ error: 'Không có quyền tạo người dùng' }, { status: 403 });
            }
        }

        // Check if user already exists in DB
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ error: 'Email đã tồn tại trong hệ thống' }, { status: 400 });
        }

        // If password is provided, create user in Supabase Auth
        let supabaseUserId: string | undefined;
        if (password) {
            // Validate password
            if (password.length < 6) {
                return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' }, { status: 400 });
            }

            const supabaseAdmin = createAdminClient();
            if (!supabaseAdmin) {
                return NextResponse.json({
                    error: 'Không thể kết nối Supabase. Vui lòng kiểm tra cấu hình SUPABASE_SERVICE_ROLE_KEY'
                }, { status: 500 });
            }

            // Create user in Supabase Auth
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: email.toLowerCase(),
                password: password,
                email_confirm: true, // Auto-confirm email
                user_metadata: {
                    name: name,
                    role: role,
                }
            });

            if (authError) {
                console.error('Supabase auth error:', authError);
                if (authError.message.includes('already been registered')) {
                    return NextResponse.json({ error: 'Email đã được đăng ký trong hệ thống xác thực' }, { status: 400 });
                }
                return NextResponse.json({ error: `Lỗi tạo tài khoản: ${authError.message}` }, { status: 500 });
            }

            supabaseUserId = authData.user?.id;
        }

        // Create user in Supabase Database
        const newUser = await createUser({
            email: email.toLowerCase(),
            name,
            role,
            isActive,
            totpEnabled: false,
            invitedBy,
            invitedAt: new Date().toISOString(),
            supabaseId: supabaseUserId,
        });

        if (!newUser) {
            return NextResponse.json({ error: 'Không thể tạo người dùng' }, { status: 500 });
        }

        // Log activity
        await logActivity({
            action: 'create',
            entity: 'auth',
            entityId: newUser.id,
            entityName: newUser.email,
            user: currentEmail || 'System',
            details: `Tạo người dùng mới: ${newUser.name} (${newUser.role})${password ? ' với mật khẩu' : ''}`,
        });

        return NextResponse.json({
            user: newUser,
            success: true,
            message: password
                ? 'Tạo người dùng thành công. Người dùng có thể đăng nhập ngay.'
                : 'Tạo người dùng thành công. Lưu ý: Chưa có mật khẩu, người dùng cần được tạo tài khoản trong Supabase hoặc sử dụng tính năng quên mật khẩu.'
        });
    } catch (error) {
        console.error('Error creating user:', error);
        const message = error instanceof Error ? error.message : 'Lỗi khi tạo người dùng';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// PUT - Update user
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body as { id: string } & Partial<AdminUser>;

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID người dùng' }, { status: 400 });
        }

        // Check permission
        const currentEmail = await getCurrentUserEmail(request);
        if (currentEmail) {
            const hasPermission = await emailHasPermission(currentEmail, 'manage_users');
            if (!hasPermission) {
                // Allow users to update their own profile (limited fields)
                const currentUser = await getUserByEmail(currentEmail);
                if (!currentUser || currentUser.id !== id) {
                    return NextResponse.json({ error: 'Không có quyền cập nhật người dùng' }, { status: 403 });
                }
                // Only allow updating name and avatar for self-update
                const allowedFields = ['name', 'avatar'] as const;
                const filteredUpdates: Partial<AdminUser> = {};
                for (const field of allowedFields) {
                    if (updates[field] !== undefined) {
                        (filteredUpdates as Record<string, unknown>)[field] = updates[field];
                    }
                }
                Object.assign(updates, filteredUpdates);
            }
        }

        // Validate role if updating
        if (updates.role) {
            const validRoles: UserRole[] = ['super_admin', 'admin', 'editor', 'viewer'];
            if (!validRoles.includes(updates.role)) {
                return NextResponse.json({ error: 'Role không hợp lệ' }, { status: 400 });
            }
        }

        const updatedUser = await updateUser(id, updates);

        if (!updatedUser) {
            return NextResponse.json({ error: 'Không thể cập nhật người dùng' }, { status: 500 });
        }

        // Log activity
        const changeDetails = Object.keys(updates).join(', ');
        await logActivity({
            action: 'update',
            entity: 'auth',
            entityId: updatedUser.id,
            entityName: updatedUser.email,
            user: currentEmail || 'System',
            details: `Cập nhật người dùng: ${changeDetails}`,
        });

        return NextResponse.json({
            user: updatedUser,
            success: true,
            message: 'Cập nhật người dùng thành công'
        });
    } catch (error) {
        console.error('Error updating user:', error);
        const message = error instanceof Error ? error.message : 'Lỗi khi cập nhật người dùng';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID người dùng' }, { status: 400 });
        }

        // Check permission - only super_admin can delete users
        const currentEmail = await getCurrentUserEmail(request);
        if (currentEmail) {
            const hasPermission = await emailHasPermission(currentEmail, 'manage_users');
            if (!hasPermission) {
                return NextResponse.json({ error: 'Không có quyền xóa người dùng' }, { status: 403 });
            }
        }

        // Prevent self-delete
        const currentUser = currentEmail ? await getUserByEmail(currentEmail) : null;
        if (currentUser && currentUser.id === id) {
            return NextResponse.json({ error: 'Không thể xóa chính mình' }, { status: 400 });
        }

        // Get user info before delete
        const allUsers = await getUsers();
        const userToDelete = allUsers.find(u => u.id === id);

        const success = await deleteUser(id);

        if (!success) {
            return NextResponse.json({ error: 'Không thể xóa người dùng' }, { status: 500 });
        }

        // Log activity
        await logActivity({
            action: 'delete',
            entity: 'auth',
            entityId: id,
            entityName: userToDelete?.email || id,
            user: currentEmail || 'System',
            details: `Xóa người dùng: ${userToDelete?.name || 'Unknown'}`,
        });

        return NextResponse.json({
            success: true,
            message: 'Xóa người dùng thành công'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        const message = error instanceof Error ? error.message : 'Lỗi khi xóa người dùng';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
