# 🚀 Supabase Schema Setup Instructions

## 📊 Current Status
- **22/28 tables** created (78.6% complete)
- **6 tables missing**
- **2 migrations** pending execution

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Execute Pending Migrations

Login to your Supabase project and run these migrations in order:

#### 1a. Admin Users Table
```sql
-- File: supabase/migrations/create_admin_users_table.sql
-- Creates: admin_users table
```
**Location:** `supabase/migrations/create_admin_users_table.sql`
**Purpose:** Admin authentication

#### 1b. Global Partners Tables
```sql
-- File: supabase/migrations/create_global_partners_tables.sql
-- Creates: global_partner_regions, global_partners tables
```
**Location:** `supabase/migrations/create_global_partners_tables.sql`
**Purpose:** Global partner management

#### 1c. Missing Tables
```sql
-- File: supabase/migrations/003_missing_tables.sql
-- Creates: services, partners, social_links
-- Fixes: products.image column
```
**Location:** `supabase/migrations/003_missing_tables.sql`
**Purpose:** Complete remaining schema

---

### Step 2: Execute in Supabase Dashboard

**Method 1: Supabase Dashboard (Recommended)**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in sidebar
4. Click **New Query**
5. Copy/paste content from each migration file
6. Click **Run** for each file in order

**Method 2: Supabase CLI**
```bash
# If you have Supabase CLI installed
cd C:\Users\ADMIN\Desktop\code-NAIT\newatlantic.vn
supabase db push
```

---

### Step 3: Verify Schema

Run this query in SQL Editor to verify all tables exist:

```sql
SELECT
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Expected Result:** 28 tables total

---

## 📋 Complete Table List

After migration, you should have:

### Product & Content (7 tables)
- ✅ products
- ✅ categories
- ✅ posts
- ✅ post_categories
- ✅ gallery_images
- ✅ catalogs
- ✅ media

### Homepage & UI (6 tables)
- ✅ hero_slides
- ✅ homepage_stats
- ✅ homepage_services
- ✅ partner_logos
- ✅ testimonials
- ✅ certifications

### Settings & Config (6 tables)
- ✅ site_settings
- ✅ seo_settings
- ✅ office_locations
- ✅ footer_links
- ✅ page_visibility
- ✅ holiday_effects

### Services & Partners (4 tables)
- 🆕 services
- 🆕 partners
- 🆕 global_partner_regions
- 🆕 global_partners

### Admin & System (4 tables)
- 🆕 admin_users
- ✅ admin_settings
- ✅ activity_logs
- 🆕 social_links

---

## 🔍 Troubleshooting

### Error: "relation already exists"
**Solution:** Table already created, skip that migration

### Error: "permission denied"
**Solution:** Make sure you're using Service Role key or have proper permissions

### Error: "column already exists"
**Solution:** Column was added in previous migration, safe to ignore

---

## ✅ Verification Checklist

After running migrations, verify:

- [ ] All 28 tables exist
- [ ] products table has both `image` and `thumbnail` columns
- [ ] social_links table exists with platform constraint
- [ ] admin_users table exists
- [ ] global_partner_regions and global_partners tables exist
- [ ] All indexes are created
- [ ] Foreign key relationships work

---

## 📝 Next Steps After Migration

1. **Update Environment Variables**
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` is set
   - Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` is set

2. **Test Database Functions**
   ```bash
   npm run dev
   # Navigate to http://localhost:3000
   # Test product pages, admin functions
   ```

3. **Seed Data (Optional)**
   - Import sample products
   - Import sample categories
   - Configure site settings

---

## 📞 Need Help?

Refer to:
- **Schema Audit:** `supabase/SCHEMA_AUDIT.md`
- **API Documentation:** `docs/API_ENDPOINTS.md`
- **Supabase Docs:** https://supabase.com/docs

