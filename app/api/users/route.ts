import { NextRequest, NextResponse } from 'next/server';
import {
    getUsers,
    getUserByEmail,
    getUserById,
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
import { AdminUser, StoredAdminUser, UserRole } from '@/types';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { verifyPasswordSync, hashPasswordSync, getSessionCookieValue, getSession } from '@/lib/auth';
import { updateUserPassword } from '@/lib/users';

/**
 * Strip the password hash before a user record crosses the network.
 *
 * `lib/users.ts` is typed as returning `AdminUser`, but the objects it reads out
 * of admin-users.json are really `StoredAdminUser` and still carry the scrypt
 * `passwordHash` at runtime — so the leak is invisible to the type checker.
 * Every user-shaped response body must go through here.
 */
function toSafeUser(user: AdminUser | StoredAdminUser): AdminUser;
function toSafeUser(user: null | undefined): null;
function toSafeUser(user: AdminUser | StoredAdminUser | null | undefined): AdminUser | null;
function toSafeUser(user: AdminUser | StoredAdminUser | null | undefined): AdminUser | null {
    if (!user) return null;
    const { passwordHash: _passwordHash, ...safe } = user as StoredAdminUser;
    return safe as AdminUser;
}

// Helper to get current user from request (from session cookie first, then header)
async function getCurrentUserEmail(request: NextRequest): Promise<string | null> {    // Try our own session cookie first
    const token = getSessionCookieValue(request);
    if (token) {
        const session = getSession(token);
        if (session) return session.email;
    }

    // Fallback: header used by some legacy client calls
    return request.headers.get('x-user-email');
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
                    return NextResponse.json({ user: toSafeUser(syncedUser) });
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

            return NextResponse.json({ user: toSafeUser(user) });
        }

        // Get user statistics
        if (action === 'stats') {
            const stats = await getUserStats();
            return NextResponse.json({ stats });
        }

        // Get single user by email
        if (email && action === 'check') {
            const user = await getUserByEmail(email);
            return NextResponse.json({ exists: !!user, user: user ? toSafeUser(user) : null });
        }

        // List all users - requires manage_users permission
        const currentEmail = await getCurrentUserEmail(request);
        if (currentEmail) {
            const hasPermission = await emailHasPermission(currentEmail, 'manage_users');
            if (!hasPermission) {
                return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
            }
        }

        let users = await getUsers();
        let stats = await getUserStats();

        // Best-effort sync: keep current user's 2FA flag aligned with per-user security settings
        // so Users Management does not show stale status.
        if (currentEmail) {
            try {
                const supabaseAdmin = createAdminClient();
                if (supabaseAdmin) {
                    const { data: securityData } = await supabaseAdmin
                        .from('admin_settings')
                        .select('value')
                        .eq('key', `security:${currentEmail.toLowerCase()}`)
                        .maybeSingle();

                    const value = securityData?.value as { totp_enabled?: boolean } | undefined;
                    const userTotpEnabled = Boolean(value?.totp_enabled);
                    const currentUserRow = users.find(u => u.email.toLowerCase() === currentEmail.toLowerCase());

                    if (currentUserRow && currentUserRow.totpEnabled !== userTotpEnabled) {
                        users = users.map(u =>
                            u.id === currentUserRow.id ? { ...u, totpEnabled: userTotpEnabled } : u
                        );
                        stats = {
                            ...stats,
                            with2FA: users.filter(u => u.totpEnabled).length,
                        };

                        // Persist sync to DB (non-blocking for response correctness)
                        await updateUser(currentUserRow.id, { totpEnabled: userTotpEnabled });
                    }
                }
            } catch (syncError) {
                console.warn('Failed to sync user 2FA status on users listing:', syncError);
            }
        }

        return NextResponse.json({
            users: users.map(u => toSafeUser(u)),
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
        const { action } = body as { action?: string };

        if (action === 'change-password') {
            const { currentPassword, newPassword, userEmail } = body as {
                currentPassword?: string;
                newPassword?: string;
                userEmail?: string;
            };

            if (!userEmail || !currentPassword || !newPassword) {
                return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
            }

            if (newPassword.length < 6) {
                return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' }, { status: 400 });
            }

            if (!/[A-Z]/.test(newPassword)) {
                return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 1 ký tự in hoa' }, { status: 400 });
            }

            if (!/[a-z]/.test(newPassword)) {
                return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 1 ký tự in thường' }, { status: 400 });
            }

            if (!/[^\w\s]/.test(newPassword)) {
                return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 1 ký tự đặc biệt' }, { status: 400 });
            }

            if (currentPassword === newPassword) {
                return NextResponse.json({ error: 'Mật khẩu mới phải khác mật khẩu hiện tại' }, { status: 400 });
            }

            const targetEmail = userEmail.toLowerCase();
            const currentEmail = (await getCurrentUserEmail(request))?.toLowerCase();
            if (!currentEmail) {
                return NextResponse.json({ error: 'Không xác định được người dùng hiện tại' }, { status: 401 });
            }
            if (currentEmail !== targetEmail) {
                return NextResponse.json({ error: 'Chỉ được đổi mật khẩu của chính bạn' }, { status: 403 });
            }

            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
            if (!supabaseUrl || !supabaseAnonKey) {
                // JSON mode: verify current password and update stored hash
                const dbUser = await getUserByEmail(targetEmail);
                if (!dbUser || !dbUser.passwordHash) {
                    return NextResponse.json(
                        { error: 'Không tìm thấy tài khoản hoặc tài khoản chưa có mật khẩu' },
                        { status: 404 }
                    );
                }

                if (!verifyPasswordSync(currentPassword, dbUser.passwordHash)) {
                    return NextResponse.json({ error: 'Mật khẩu hiện tại không đúng' }, { status: 401 });
                }

                const updated = await updateUserPassword(dbUser.id, newPassword);
                if (!updated) {
                    return NextResponse.json({ error: 'Không thể cập nhật mật khẩu' }, { status: 500 });
                }

                await logActivity({
                    action: 'update',
                    entity: 'auth',
                    entityId: dbUser.id,
                    entityName: targetEmail,
                    user: currentEmail,
                    details: 'Đổi mật khẩu trong JSON local mode',
                });

                return NextResponse.json({
                    success: true,
                    message: 'Đổi mật khẩu thành công',
                });
            }

            // Verify current password first
            const verifyClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
                auth: { autoRefreshToken: false, persistSession: false }
            });
            const { error: verifyError } = await verifyClient.auth.signInWithPassword({
                email: targetEmail,
                password: currentPassword,
            });

            if (verifyError) {
                return NextResponse.json({ error: 'Mật khẩu hiện tại không đúng' }, { status: 401 });
            }

            const supabaseAdmin = createAdminClient();
            if (!supabaseAdmin) {
                return NextResponse.json({ error: 'Không thể kết nối Supabase Admin' }, { status: 500 });
            }

            const dbUser = await getUserByEmail(targetEmail);
            let supabaseUserId = dbUser?.supabaseId;

            // Fallback: find auth user by email if DB row does not have supabase_id
            if (!supabaseUserId) {
                const { data: authUsersData, error: listUsersError } = await supabaseAdmin.auth.admin.listUsers();
                if (listUsersError) {
                    return NextResponse.json({ error: `Không thể lấy danh sách user auth: ${listUsersError.message}` }, { status: 500 });
                }

                const authUser = authUsersData.users.find(u => u.email?.toLowerCase() === targetEmail);
                if (!authUser) {
                    return NextResponse.json({ error: 'Không tìm thấy tài khoản xác thực cho email này' }, { status: 404 });
                }
                supabaseUserId = authUser.id;

                if (dbUser && !dbUser.supabaseId) {
                    await updateUser(dbUser.id, { supabaseId: supabaseUserId });
                }
            }

            const { error: updatePasswordError } = await supabaseAdmin.auth.admin.updateUserById(
                supabaseUserId,
                { password: newPassword }
            );

            if (updatePasswordError) {
                return NextResponse.json({ error: `Không thể cập nhật mật khẩu: ${updatePasswordError.message}` }, { status: 500 });
            }

            await logActivity({
                action: 'update',
                entity: 'auth',
                entityId: dbUser?.id || supabaseUserId,
                entityName: targetEmail,
                user: currentEmail,
                details: 'Đổi mật khẩu tài khoản admin',
            });

            return NextResponse.json({
                success: true,
                message: 'Đổi mật khẩu thành công',
            });
        }

        if (action === 'admin-change-user-password') {
            const { userId, newPassword } = body as {
                userId?: string;
                newPassword?: string;
            };

            if (!userId || !newPassword) {
                return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
            }

            if (newPassword.length < 6) {
                return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' }, { status: 400 });
            }

            if (!/[A-Z]/.test(newPassword)) {
                return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 1 ký tự in hoa' }, { status: 400 });
            }

            if (!/[a-z]/.test(newPassword)) {
                return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 1 ký tự in thường' }, { status: 400 });
            }

            if (!/[^\w\s]/.test(newPassword)) {
                return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 1 ký tự đặc biệt' }, { status: 400 });
            }

            const currentEmail = (await getCurrentUserEmail(request))?.toLowerCase();
            if (!currentEmail) {
                return NextResponse.json({ error: 'Không xác định được người dùng hiện tại' }, { status: 401 });
            }

            const hasPermission = await emailHasPermission(currentEmail, 'manage_users');
            if (!hasPermission) {
                return NextResponse.json({ error: 'Không có quyền đổi mật khẩu người dùng' }, { status: 403 });
            }

            const currentUser = await getUserByEmail(currentEmail);
            if (!currentUser || !currentUser.isActive) {
                return NextResponse.json({ error: 'Tài khoản hiện tại không hợp lệ' }, { status: 403 });
            }

            const targetUser = await getUserById(userId);
            if (!targetUser) {
                return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 });
            }

            if (targetUser.email.toLowerCase() === currentEmail) {
                return NextResponse.json({
                    error: 'Vui lòng dùng mục Cài đặt bảo mật để đổi mật khẩu của chính bạn'
                }, { status: 400 });
            }

            if (targetUser.role === 'super_admin' && currentUser.role !== 'super_admin') {
                return NextResponse.json({ error: 'Không có quyền đổi mật khẩu cho Super Admin' }, { status: 403 });
            }

            const supabaseAdmin = createAdminClient();
            if (!supabaseAdmin) {
                // JSON mode: only Super Admin can reset another user's password
                if (currentUser.role !== 'super_admin') {
                    return NextResponse.json({ error: 'Chỉ Super Admin mới được đặt lại mật khẩu người dùng' }, { status: 403 });
                }

                const updated = await updateUserPassword(targetUser.id, newPassword);
                if (!updated) {
                    return NextResponse.json({ error: 'Không thể cập nhật mật khẩu' }, { status: 500 });
                }

                await logActivity({
                    action: 'update',
                    entity: 'auth',
                    entityId: targetUser.id,
                    entityName: targetUser.email,
                    user: currentEmail,
                    details: `Đổi mật khẩu bởi quản trị viên cho tài khoản ${targetUser.email}`,
                });

                return NextResponse.json({
                    success: true,
                    message: `Đã đổi mật khẩu cho ${targetUser.email}`,
                });
            }

            let supabaseUserId = targetUser.supabaseId;

            // Fallback: find auth user by email if DB row does not have supabase_id
            if (!supabaseUserId) {
                const { data: authUsersData, error: listUsersError } = await supabaseAdmin.auth.admin.listUsers();
                if (listUsersError) {
                    return NextResponse.json({ error: `Không thể lấy danh sách user auth: ${listUsersError.message}` }, { status: 500 });
                }

                const authUser = authUsersData.users.find(u => u.email?.toLowerCase() === targetUser.email.toLowerCase());
                if (!authUser) {
                    return NextResponse.json({ error: 'Không tìm thấy tài khoản xác thực cho người dùng này' }, { status: 404 });
                }

                supabaseUserId = authUser.id;
                await updateUser(targetUser.id, { supabaseId: supabaseUserId });
            }

            const { error: updatePasswordError } = await supabaseAdmin.auth.admin.updateUserById(
                supabaseUserId,
                { password: newPassword }
            );

            if (updatePasswordError) {
                return NextResponse.json({ error: `Không thể cập nhật mật khẩu: ${updatePasswordError.message}` }, { status: 500 });
            }

            await logActivity({
                action: 'update',
                entity: 'auth',
                entityId: targetUser.id,
                entityName: targetUser.email,
                user: currentEmail,
                details: `Đổi mật khẩu bởi quản trị viên cho tài khoản ${targetUser.email}`,
            });

            return NextResponse.json({
                success: true,
                message: `Đã đổi mật khẩu cho ${targetUser.email}`,
            });
        }

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

        // If password is provided, create user in Supabase Auth (or hash for JSON mode)
        let supabaseUserId: string | undefined;
        let passwordHash: string | undefined;
        if (password) {
            // Validate password
            if (password.length < 6) {
                return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' }, { status: 400 });
            }

            const supabaseAdmin = createAdminClient();
            if (!supabaseAdmin) {
                // JSON local mode: hash password locally
                supabaseUserId = undefined;
                passwordHash = hashPasswordSync(password);
            } else {
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
        }

        // Create user in admin users
        const newUser = await createUser(
            {
                email: email.toLowerCase(),
                name,
                role,
                isActive,
                totpEnabled: false,
                invitedBy,
                invitedAt: new Date().toISOString(),
                supabaseId: supabaseUserId,
            },
            passwordHash
        );

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
            user: toSafeUser(newUser),
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

        // If admin forces 2FA off for a user, clear per-user TOTP secret/settings as well.
        if (updates.totpEnabled === false) {
            const supabaseAdmin = createAdminClient();
            if (supabaseAdmin) {
                const totpKey = `security:${updatedUser.email.toLowerCase()}`;
                await supabaseAdmin
                    .from('admin_settings')
                    .upsert({
                        key: totpKey,
                        value: {
                            totp_enabled: false,
                            totp_secret: null,
                            updated_at: new Date().toISOString(),
                        },
                        updated_at: new Date().toISOString(),
                    }, { onConflict: 'key' });
            }
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
            user: toSafeUser(updatedUser),
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
