# JSON to Supabase Migration Guide

## Overview

This guide covers the migration from JSON file storage to Supabase database for the New Atlantic website.

## Files Created

| File | Purpose |
|------|---------|
| `supabase/migrations/001_full_migration.sql` | SQL script to create all 22 tables |
| `lib/db-supabase.ts` | Supabase version of db.ts with all CRUD functions |
| `lib/db-config.ts` | Configuration to toggle between JSON and Supabase |
| `scripts/seed-supabase.ts` | Script to migrate JSON data to Supabase |

## Step 1: Create Supabase Tables

1. Go to your Supabase Dashboard → SQL Editor
2. Copy and run the contents of `supabase/migrations/001_full_migration.sql`
3. Verify all 22 tables are created in Table Editor

## Step 2: Configure Environment Variables

Ensure your `.env.local` has these variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DB_MODE=json  # Change to 'supabase' when ready
```

## Step 3: Seed Data to Supabase

Run the seed script to migrate JSON data:

```bash
npx ts-node scripts/seed-supabase.ts
```

## Step 4: Test with Supabase

1. Change `.env.local`:
   ```env
   DB_MODE=supabase
   ```

2. Restart the dev server

3. Test all admin functions work correctly

## Step 5: Update API Routes (Optional)

For new async operations, update imports in API routes:

```typescript
// Before (JSON)
import { getProducts } from '@/lib/db';

// After (Supabase)
import { getProducts } from '@/lib/db-supabase';
```

Note: Supabase functions are async, so add `await`:

```typescript
// Before
const products = getProducts();

// After
const products = await getProducts();
```

## Tables Created

| Table | JSON File | Purpose |
|-------|-----------|---------|
| products | products.json | Product catalog |
| categories | categories.json | Product categories |
| posts | posts.json | Blog posts |
| post_categories | post-categories.json | Blog categories |
| media | media.json | Media library |
| gallery_images | gallery-images.json | Gallery |
| site_settings | site-settings.json | Site configuration |
| seo_settings | seo.json | SEO settings |
| hero_slides | hero-slides.json | Homepage hero |
| homepage_stats | homepage-stats.json | Stats section |
| homepage_services | homepage-services.json | Services section |
| partner_logos | partner-logos.json | Partner logos |
| testimonials | testimonials.json | Testimonials |
| faqs | faqs.json | FAQ items |
| certifications | certifications.json | Certifications |
| catalogs | catalogs.json | PDF catalogs |
| office_locations | office-locations.json | Office addresses |
| footer_links | footer-links.json | Footer navigation |
| page_visibility | page-visibility.json | Page toggles |
| holiday_effects | holiday-effects.json | Holiday decorations |
| activity_logs | activity-logs.json | Audit trail |
| admin_settings | admin-settings.json | Admin config |

## Rollback

To switch back to JSON storage:

```env
DB_MODE=json
```

Restart the dev server - your JSON data is still intact.

## Next Steps

1. ✅ Run migration SQL in Supabase
2. ✅ Run seed script
3. ✅ Test in development
4. ⬜ Update remaining API routes to async
5. ⬜ Set DB_MODE=supabase in production
6. ⬜ Set up Supabase Storage for media files
