# Supabase Schema Audit Report
**Date:** 2026-02-06
**Project:** newatlantic.vn

## Executive Summary

**TypeScript Interfaces:** 28 types defined
**Migration Tables:** 22 tables created
**Missing Tables:** 6 tables
**Status:** ⚠️ **INCOMPLETE SCHEMA** - Critical tables missing

---

## ✅ Tables Already Created (22 tables)

1. ✅ **products** - Main product catalog
2. ✅ **categories** - Product categories
3. ✅ **posts** - Blog/news posts
4. ✅ **post_categories** - Post categorization
5. ✅ **media** - Media library
6. ✅ **gallery_images** - Gallery images
7. ✅ **site_settings** - Site configuration
8. ✅ **seo_settings** - SEO metadata
9. ✅ **hero_slides** - Homepage hero carousel
10. ✅ **homepage_stats** - Homepage statistics
11. ✅ **homepage_services** - Homepage services section
12. ✅ **partner_logos** - Partner/client logos
13. ✅ **testimonials** - Customer testimonials
14. ✅ **faqs** - FAQ entries
15. ✅ **certifications** - Company certifications
16. ✅ **catalogs** - Product catalogs/brochures
17. ✅ **office_locations** - Office addresses
18. ✅ **footer_links** - Footer navigation links
19. ✅ **page_visibility** - Page visibility settings
20. ✅ **holiday_effects** - Holiday themes/effects
21. ✅ **activity_logs** - Admin activity tracking
22. ✅ **admin_settings** - Admin panel settings

---

## ❌ MISSING TABLES (6 tables)

### 1. ❌ **services** table
**TypeScript Interface:** `Service`
**Required Columns:**
- id (TEXT PRIMARY KEY)
- title (TEXT NOT NULL)
- slug (TEXT UNIQUE NOT NULL)
- description (TEXT)
- icon (TEXT)
- image (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**Usage:** Referenced in types but no table exists

---

### 2. ❌ **partners** table
**TypeScript Interface:** `Partner`
**Required Columns:**
- id (TEXT PRIMARY KEY)
- name (TEXT NOT NULL)
- logo (TEXT)
- url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**Usage:** Basic partner/client listing (simpler than partner_logos)

---

### 3. ❌ **social_links** table
**TypeScript Interface:** `SocialLink`
**Required Columns:**
- id (TEXT PRIMARY KEY)
- platform (TEXT) -- facebook, youtube, linkedin, zalo, instagram
- url (TEXT NOT NULL)
- enabled (BOOLEAN DEFAULT true)
- order_index (INTEGER DEFAULT 0)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**Usage:** Currently stored as JSONB in site_settings, but TypeScript expects separate table

---

### 4. ❌ **global_partner_regions** table
**TypeScript Interface:** `GlobalPartnerRegion`
**Required Columns:**
- id (TEXT PRIMARY KEY)
- name (TEXT NOT NULL)
- order_index (INTEGER DEFAULT 0)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**Note:** Migration file `create_global_partners_tables.sql` exists but may not have been executed

---

### 5. ❌ **global_partners** table
**TypeScript Interface:** `GlobalPartner`
**Required Columns:**
- id (TEXT PRIMARY KEY)
- region_id (TEXT) REFERENCES global_partner_regions(id)
- name (TEXT NOT NULL)
- logo (TEXT)
- website (TEXT)
- country (TEXT)
- order_index (INTEGER DEFAULT 0)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**Note:** Migration file `create_global_partners_tables.sql` exists but may not have been executed

---

### 6. ❌ **admin_users** table
**TypeScript Interface:** `AdminUser`
**Required Columns:**
- id (TEXT PRIMARY KEY)
- email (TEXT UNIQUE NOT NULL)
- password_hash (TEXT NOT NULL)
- name (TEXT)
- role (TEXT DEFAULT 'admin')
- avatar (TEXT)
- is_active (BOOLEAN DEFAULT true)
- last_login (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**Note:** Migration file `create_admin_users_table.sql` exists but may not have been executed

---

## 🔧 COLUMN MISMATCHES IN EXISTING TABLES

### **products** table
**TypeScript expects:**
- `image` (string) - Single image URL
- `images` (string[]) - Multiple images array

**Database has:**
- `images` (TEXT[]) - Multiple images ✅
- `thumbnail` (TEXT) - Main image ⚠️ **Field name mismatch**

**Fix:** Either:
1. Add `image` column as alias to `thumbnail`
2. Update TypeScript to use `thumbnail` instead of `image`

---

### **site_settings** table
**TypeScript expects:**
- `socialLinks` (SocialLink[]) - Array of objects

**Database has:**
- Likely stored as JSONB but should be separate `social_links` table

**Fix:** Create separate `social_links` table with foreign key to site_settings

---

## 📝 MIGRATION FILES NOT EXECUTED

Found in `/supabase/migrations/` but not reflected in schema:

1. ❌ **create_admin_users_table.sql** - Not executed
2. ❌ **create_global_partners_tables.sql** - Not executed

**Action Required:** Execute these migrations in Supabase

---

## 🚀 RECOMMENDED ACTIONS

### Priority 1: Execute Existing Migrations
```bash
# In Supabase Dashboard or CLI
1. Run: create_admin_users_table.sql
2. Run: create_global_partners_tables.sql
```

### Priority 2: Create Missing Tables
Create migrations for:
- services
- partners (simple version)
- social_links

### Priority 3: Fix Column Mismatches
- Add `image` column to products (or update TypeScript)
- Migrate social_links from JSONB to separate table

---

## 📋 NEXT STEPS

1. **Execute pending migrations** (admin_users, global_partners)
2. **Create missing tables** (services, partners, social_links)
3. **Verify all columns** match TypeScript definitions
4. **Update db-supabase.ts** functions for new tables
5. **Test all CRUD operations**

---

## 🎯 COMPLETION STATUS

**Schema Completeness:** 22/28 tables = **78.6% complete**

**Missing:**
- 6 tables need to be created
- 2 migrations need to be executed
- Column name mismatches need resolution

