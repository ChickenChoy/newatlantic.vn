import { AdminUser, UserRole, Permission, hasPermission, PERMISSION_MATRIX } from '@/types';
import { createAdminClient } from './supabase';

// Supabase table name
const TABLE_NAME = 'admin_users';

// Helper to convert Supabase row to AdminUser
function rowToAdminUser(row: Record<string, unknown>): AdminUser {
    return {
        id: row.id as string,
        email: row.email as string,
        name: row.name as string,
        role: row.role as UserRole,
        avatar: row.avatar as string | undefined,
        isActive: row.is_active as boolean,
        totpEnabled: row.totp_enabled as boolean,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
        lastLogin: row.last_login as string | undefined,
        invitedBy: row.invited_by as string | undefined,
        invitedAt: row.invited_at as string | undefined,
        supabaseId: row.supabase_id as string | undefined,
    };
}

// Helper to convert AdminUser to Supabase row format
function adminUserToRow(user: Partial<AdminUser>): Record<string, unknown> {
    const row: Record<string, unknown> = {};

    if (user.email !== undefined) row.email = user.email;
    if (user.name !== undefined) row.name = user.name;
    if (user.role !== undefined) row.role = user.role;
    if (user.avatar !== undefined) row.avatar = user.avatar;
    if (user.isActive !== undefined) row.is_active = user.isActive;
    if (user.totpEnabled !== undefined) row.totp_enabled = user.totpEnabled;
    if (user.lastLogin !== undefined) row.last_login = user.lastLogin;
    if (user.invitedBy !== undefined) row.invited_by = user.invitedBy;
    if (user.invitedAt !== undefined) row.invited_at = user.invitedAt;
    if (user.supabaseId !== undefined) row.supabase_id = user.supabaseId;

    return row;
}

// Get Supabase admin client (with error handling)
function getSupabaseAdmin() {
    const client = createAdminClient();
    if (!client) {
        throw new Error('Không thể kết nối Supabase. Vui lòng kiểm tra cấu hình.');
    }
    return client;
}

// ==================== CRUD Operations ====================

/**
 * Get all admin users
 */
export async function getUsers(): Promise<AdminUser[]> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching users:', error);
        return [];
    }

    return (data || []).map(rowToAdminUser);
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<AdminUser | null> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        return null;
    }

    return rowToAdminUser(data);
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<AdminUser | null> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .ilike('email', email)
        .single();

    if (error || !data) {
        return null;
    }

    return rowToAdminUser(data);
}

/**
 * Create a new user
 */
export async function createUser(
    user: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AdminUser | null> {
    const supabase = getSupabaseAdmin();

    // Check if email already exists
    const existing = await getUserByEmail(user.email);
    if (existing) {
        throw new Error('Email đã tồn tại');
    }

    const insertData = adminUserToRow(user);

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert(insertData)
        .select()
        .single();

    if (error) {
        console.error('Error creating user:', error);
        throw new Error(error.message);
    }

    return data ? rowToAdminUser(data) : null;
}

/**
 * Update an existing user
 */
export async function updateUser(
    id: string,
    updates: Partial<Omit<AdminUser, 'id' | 'createdAt'>>
): Promise<AdminUser | null> {
    const supabase = getSupabaseAdmin();

    // Get current user
    const currentUser = await getUserById(id);
    if (!currentUser) {
        throw new Error('Người dùng không tồn tại');
    }

    // If updating email, check for duplicates
    if (updates.email && updates.email.toLowerCase() !== currentUser.email.toLowerCase()) {
        const existing = await getUserByEmail(updates.email);
        if (existing) {
            throw new Error('Email đã tồn tại');
        }
    }

    // Prevent changing super_admin role of the last super admin
    if (currentUser.role === 'super_admin' && updates.role && updates.role !== 'super_admin') {
        const allUsers = await getUsers();
        const otherSuperAdmins = allUsers.filter(u => u.id !== id && u.role === 'super_admin');
        if (otherSuperAdmins.length === 0) {
            throw new Error('Phải có ít nhất một Super Admin');
        }
    }

    // Prevent deactivating the last super admin
    if (currentUser.role === 'super_admin' && updates.isActive === false) {
        const allUsers = await getUsers();
        const activeSuperAdmins = allUsers.filter(u => u.id !== id && u.role === 'super_admin' && u.isActive);
        if (activeSuperAdmins.length === 0) {
            throw new Error('Không thể tắt kích hoạt Super Admin cuối cùng');
        }
    }

    const updateData = adminUserToRow(updates);

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating user:', error);
        throw new Error(error.message);
    }

    return data ? rowToAdminUser(data) : null;
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();

    // Get user to check role
    const user = await getUserById(id);
    if (!user) {
        throw new Error('Người dùng không tồn tại');
    }

    // Prevent deleting the last super_admin
    if (user.role === 'super_admin') {
        const allUsers = await getUsers();
        const superAdmins = allUsers.filter(u => u.role === 'super_admin');
        if (superAdmins.length <= 1) {
            throw new Error('Không thể xóa Super Admin cuối cùng');
        }
    }

    const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting user:', error);
        throw new Error(error.message);
    }

    return true;
}

/**
 * Activate or deactivate a user
 */
export async function toggleUserActive(id: string, isActive: boolean): Promise<AdminUser | null> {
    return updateUser(id, { isActive });
}

/**
 * Update user's last login time
 */
export async function updateLastLogin(id: string): Promise<AdminUser | null> {
    return updateUser(id, { lastLogin: new Date().toISOString() });
}

/**
 * Update user's TOTP status
 */
export async function updateUserTotpStatus(id: string, totpEnabled: boolean): Promise<AdminUser | null> {
    return updateUser(id, { totpEnabled });
}

// ==================== Permission Functions ====================

/**
 * Check if a user has a specific permission
 */
export async function userHasPermission(userId: string, permission: Permission): Promise<boolean> {
    const user = await getUserById(userId);
    if (!user || !user.isActive) {
        return false;
    }
    return hasPermission(user.role, permission);
}

/**
 * Check if a user can perform an action based on email
 */
export async function emailHasPermission(email: string, permission: Permission): Promise<boolean> {
    const user = await getUserByEmail(email);
    if (!user || !user.isActive) {
        return false;
    }
    return hasPermission(user.role, permission);
}

/**
 * Get all permissions for a user
 */
export async function getUserPermissions(userId: string): Promise<Permission[]> {
    const user = await getUserById(userId);
    if (!user || !user.isActive) {
        return [];
    }
    return PERMISSION_MATRIX[user.role] || [];
}

/**
 * Get all permissions for a user by email
 */
export async function getUserPermissionsByEmail(email: string): Promise<Permission[]> {
    const user = await getUserByEmail(email);
    if (!user || !user.isActive) {
        return [];
    }
    return PERMISSION_MATRIX[user.role] || [];
}

// ==================== Statistics ====================

/**
 * Get user statistics
 */
export async function getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<UserRole, number>;
    with2FA: number;
}> {
    const users = await getUsers();

    const stats = {
        total: users.length,
        active: users.filter(u => u.isActive).length,
        inactive: users.filter(u => !u.isActive).length,
        byRole: {
            super_admin: 0,
            admin: 0,
            editor: 0,
            viewer: 0,
        } as Record<UserRole, number>,
        with2FA: users.filter(u => u.totpEnabled).length,
    };

    users.forEach(user => {
        stats.byRole[user.role]++;
    });

    return stats;
}

// ==================== Sync Functions ====================

/**
 * Sync user from Supabase auth (create if not exists)
 */
export async function syncUserFromAuth(email: string, name?: string, supabaseId?: string): Promise<AdminUser> {
    let user = await getUserByEmail(email);

    if (!user) {
        // Check if this is the first user (should be super_admin)
        const existingUsers = await getUsers();
        const role: UserRole = existingUsers.length === 0 ? 'super_admin' : 'viewer';

        const newUser = await createUser({
            email,
            name: name || email.split('@')[0],
            role,
            isActive: true,
            totpEnabled: false,
            supabaseId,
        });

        if (!newUser) {
            throw new Error('Không thể tạo người dùng');
        }

        user = newUser;
    } else if (supabaseId && !user.supabaseId) {
        // Update supabaseId if missing
        user = await updateUser(user.id, { supabaseId }) || user;
    }

    // Update last login
    await updateLastLogin(user.id);

    return user;
}

/**
 * Initialize - ensure at least one super admin exists
 */
export async function initializeUsers(): Promise<void> {
    const users = await getUsers();

    // Ensure at least one super_admin exists
    if (!users.some(u => u.role === 'super_admin')) {
        await createUser({
            email: 'admin@newatlantic.vn',
            name: 'Super Admin',
            role: 'super_admin',
            isActive: true,
            totpEnabled: false,
        });
    }
}
