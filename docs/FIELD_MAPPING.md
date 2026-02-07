# Field Mapping Documentation

## CamelCase vs Snake_Case Conversion

Dự án này sử dụng:
- **Frontend/TypeScript**: camelCase
- **Database (Supabase/PostgreSQL)**: snake_case

### Automatic Conversion

Function `camelToSnake()` trong `lib/db-supabase.ts` tự động convert:
- `categoryName` → `category_name` ✅
- `shortDescription` → `short_description` ✅
- `isFeatured` → `is_featured` ✅

### Special Cases - Manual Mapping Required

#### 1. Products Table

**Problem**: Frontend gửi `featured` (lowercase, không chữ hoa) → `camelToSnake()` không convert → Database cần `is_featured`

**Solution**: Manual mapping trong `/api/products/route.ts`:

```typescript
// PUT - Update product
if ('featured' in updates) {
  supabaseUpdates.isFeatured = updates.featured;
  delete supabaseUpdates.featured;
}

// POST - Create product
const newProduct = {
  ...
  isFeatured: featured || false, // Not 'featured'
  ...
};
```

#### 2. Posts Table (Future)

Database có `is_featured` column nhưng TypeScript interface chưa có field này.

**TODO**: Nếu cần dùng featured posts:
1. Add `featured?: boolean` to Post interface
2. Add manual mapping tương tự products

### Tables Schema Reference

| Table | Featured Column | Mapping Needed |
|-------|----------------|----------------|
| `products` | `is_featured` | ✅ Yes (manual) |
| `posts` | `is_featured` | ⚠️ Not used yet |
| `gallery_images` | `featured` | ❌ No (already snake_case) |

### Testing

Test case để verify mapping hoạt động:
```javascript
// Input từ frontend
{ featured: true, name: "Test Product" }

// Sau manual mapping
{ isFeatured: true, name: "Test Product" }

// Sau camelToSnake()
{ is_featured: true, name: "Test Product" }

// ✅ Supabase nhận đúng column name
```

## Nguyên tắc

1. **Prefer automatic**: Dùng camelCase có ký tự hoa để `camelToSnake()` tự convert
2. **Manual only when necessary**: Chỉ manual mapping cho lowercase fields như `featured`
3. **Document exceptions**: Ghi lại tất cả special cases trong file này
