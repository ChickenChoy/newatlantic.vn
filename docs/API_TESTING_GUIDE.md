# API Testing Guide - Hướng Dẫn Kiểm Thử API

> **Mục đích**: Hướng dẫn test thủ công các API endpoints đã tối ưu hóa
> **Thời gian**: ~30 phút cho full test suite
> **Tools**: cURL, Browser DevTools, hoặc Postman

---

## 🎯 Test Checklist - Danh Sách Kiểm Thử

### Phase 1: Pagination Tests (10 phút)

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | GET `/api/products?limit=5&page=1` | Trả về 5 sản phẩm đầu | ⬜ |
| 2 | GET `/api/products?limit=5&page=2` | Trả về 5 sản phẩm tiếp theo | ⬜ |
| 3 | GET `/api/products?limit=0` | Error: "Invalid limit" (400) | ⬜ |
| 4 | GET `/api/products?limit=101` | Error: "Invalid limit" (400) | ⬜ |
| 5 | GET `/api/products?page=0` | Error: "Invalid page" (400) | ⬜ |
| 6 | GET `/api/products?page=-1` | Error: "Invalid page" (400) | ⬜ |
| 7 | GET `/api/products?page=invalid` | Error: "Invalid page" (400) | ⬜ |

### Phase 2: Filtering Tests (10 phút)

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 8 | GET `/api/products?category=may-bom` | Chỉ sản phẩm danh mục may-bom | ⬜ |
| 9 | GET `/api/products?featured=true` | Chỉ sản phẩm nổi bật | ⬜ |
| 10 | GET `/api/products/paginated?search=diesel` | Sản phẩm có từ "diesel" | ⬜ |
| 11 | GET `/api/products?category=may-bom&limit=10` | 10 sản phẩm danh mục may-bom | ⬜ |

### Phase 3: CRUD Operations (10 phút)

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 12 | POST `/api/products` (valid data) | 201 Created + product data | ⬜ |
| 13 | POST `/api/products` (missing slug) | 400 "required" error | ⬜ |
| 14 | POST `/api/products` (duplicate slug) | 400 "already exists" | ⬜ |
| 15 | PUT `/api/products` (valid update) | 200 OK + updated data | ⬜ |
| 16 | PUT `/api/products` (invalid ID) | 404 "not found" | ⬜ |
| 17 | DELETE `/api/products?id=valid` | 200 OK + success:true | ⬜ |
| 18 | DELETE `/api/products?id=invalid` | 404 "not found" | ⬜ |

### Phase 4: Performance Tests (Bonus)

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 19 | Check Cache-Control header | Contains "s-maxage" | ⬜ |
| 20 | Response time < 200ms | Fast response | ⬜ |
| 21 | Large dataset (limit=100) | Still performs well | ⬜ |

---

## 📝 Detailed Test Scripts

### Test #1-2: Basic Pagination

```bash
# Test 1: Page 1
curl -s "http://localhost:3000/api/products?limit=5&page=1" | jq '.[] | {id, name}'

# Test 2: Page 2
curl -s "http://localhost:3000/api/products?limit=5&page=2" | jq '.[] | {id, name}'

# Verify: IDs should be different between page 1 and 2
```

**Expected**:
- Page 1 returns first 5 products
- Page 2 returns next 5 products
- No duplicates between pages

### Test #3-7: Validation Tests

```bash
# Test 3: Invalid limit (too small)
curl -s "http://localhost:3000/api/products?limit=0" | jq '.'
# Expected: {"error": "Invalid limit. Must be between 1 and 100"}

# Test 4: Invalid limit (too large)
curl -s "http://localhost:3000/api/products?limit=101" | jq '.'
# Expected: {"error": "Invalid limit. Must be between 1 and 100"}

# Test 5: Invalid page (zero)
curl -s "http://localhost:3000/api/products?page=0" | jq '.'
# Expected: {"error": "Invalid page number"}

# Test 6: Invalid page (negative)
curl -s "http://localhost:3000/api/products?page=-1" | jq '.'
# Expected: {"error": "Invalid page number"}

# Test 7: Invalid page (non-number)
curl -s "http://localhost:3000/api/products?page=abc" | jq '.'
# Expected: {"error": "Invalid page number"}
```

### Test #8-11: Filtering Tests

```bash
# Test 8: Category filter
curl -s "http://localhost:3000/api/products?category=may-bom" | jq '.[] | .category'
# Expected: All results should have category="may-bom"

# Test 9: Featured filter
curl -s "http://localhost:3000/api/products?featured=true" | jq '.[] | .featured'
# Expected: All results should have featured=true

# Test 10: Search functionality
curl -s "http://localhost:3000/api/products/paginated?search=diesel" | jq '.products[] | .name'
# Expected: All names should contain "diesel" (case-insensitive)

# Test 11: Combined filters
curl -s "http://localhost:3000/api/products?category=may-bom&limit=10" | jq 'length'
# Expected: Should return max 10 items, all from may-bom category
```

### Test #12-14: CREATE Tests

```bash
# Test 12: Valid create
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "slug": "test-product-'$(date +%s)'",
    "category": "may-bom",
    "description": "Test description"
  }' | jq '.'
# Expected: 201 status + full product object with generated ID

# Test 13: Missing required field
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product"
  }' | jq '.'
# Expected: {"error": "Name, slug and category are required"}

# Test 14: Duplicate slug
# First, create a product
SLUG="duplicate-test-$(date +%s)"
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"First\",\"slug\":\"$SLUG\",\"category\":\"test\"}"

# Then try to create with same slug
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Second\",\"slug\":\"$SLUG\",\"category\":\"test\"}" | jq '.'
# Expected: {"error": "Slug already exists"}
```

### Test #15-16: UPDATE Tests

```bash
# Test 15: Valid update
# First get a product ID
PRODUCT_ID=$(curl -s "http://localhost:3000/api/products?limit=1" | jq -r '.[0].id')

# Then update it
curl -X PUT http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d "{
    \"id\": \"$PRODUCT_ID\",
    \"name\": \"Updated Name $(date +%H:%M:%S)\"
  }" | jq '.name'
# Expected: 200 status + shows updated name

# Test 16: Update non-existent product
curl -X PUT http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "id": "non-existent-id-999999",
    "name": "Updated Name"
  }' | jq '.'
# Expected: {"error": "Product not found"}
```

### Test #17-18: DELETE Tests

```bash
# Test 17: Valid delete
# Create a test product first
TEST_PRODUCT=$(curl -s -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"To Delete\",\"slug\":\"to-delete-$(date +%s)\",\"category\":\"test\"}")

PRODUCT_ID=$(echo $TEST_PRODUCT | jq -r '.id')

# Delete it
curl -X DELETE "http://localhost:3000/api/products?id=$PRODUCT_ID" | jq '.'
# Expected: {"success": true}

# Test 18: Delete non-existent
curl -X DELETE "http://localhost:3000/api/products?id=non-existent-999" | jq '.'
# Expected: {"error": "Product not found"}
```

### Test #19: Cache Headers

```bash
# Test 19: Check cache headers
curl -I "http://localhost:3000/api/products" | grep -i cache-control
# Expected: Cache-Control: public, s-maxage=60, stale-while-revalidate=120

curl -I "http://localhost:3000/api/products?id=123" | grep -i cache-control
# Expected: Cache-Control: public, s-maxage=300, stale-while-revalidate=600
```

### Test #20-21: Performance Tests

```bash
# Test 20: Measure response time
time curl -s "http://localhost:3000/api/products?limit=10" > /dev/null
# Expected: Should complete in < 200ms

# Test 21: Large dataset
time curl -s "http://localhost:3000/api/products?limit=100" > /dev/null
# Expected: Should still be reasonably fast (< 500ms)

# Detailed timing
curl -w "\nTime Total: %{time_total}s\nTime Connect: %{time_connect}s\n" \
  -s "http://localhost:3000/api/products?limit=50" \
  -o /dev/null
```

---

## 🔍 Browser DevTools Testing

### Console Tests

Mở browser console và chạy:

```javascript
// Test pagination
async function testPagination() {
  const page1 = await fetch('/api/products?limit=5&page=1').then(r => r.json());
  const page2 = await fetch('/api/products?limit=5&page=2').then(r => r.json());

  console.log('Page 1 IDs:', page1.map(p => p.id));
  console.log('Page 2 IDs:', page2.map(p => p.id));
  console.log('No duplicates:', !page1.some(p1 => page2.some(p2 => p1.id === p2.id)));
}

// Test validation
async function testValidation() {
  const tests = [
    { url: '/api/products?limit=0', expectedError: 'Invalid limit' },
    { url: '/api/products?page=-1', expectedError: 'Invalid page' },
  ];

  for (const test of tests) {
    const response = await fetch(test.url);
    const data = await response.json();
    console.log(`${test.url}:`, data.error.includes(test.expectedError) ? '✅ PASS' : '❌ FAIL');
  }
}

// Test cache headers
async function testCacheHeaders() {
  const response = await fetch('/api/products');
  const cacheControl = response.headers.get('Cache-Control');
  console.log('Cache-Control:', cacheControl);
  console.log('Has s-maxage:', cacheControl.includes('s-maxage') ? '✅ PASS' : '❌ FAIL');
}

// Run all tests
await testPagination();
await testValidation();
await testCacheHeaders();
```

### Network Tab Testing

1. Mở DevTools → Network tab
2. Load `/api/products?limit=10`
3. Kiểm tra:
   - ✅ Status: 200
   - ✅ Response time < 200ms
   - ✅ Headers có `Cache-Control`
   - ✅ Response size hợp lý (không quá lớn)

---

## 📊 Test Results Template

Sau khi chạy tests, ghi lại kết quả:

```
=== API TEST RESULTS ===
Date: _______________
Tester: _______________

PAGINATION TESTS
[ ] Test 1-7: All passed

FILTERING TESTS
[ ] Test 8-11: All passed

CRUD TESTS
[ ] Test 12-18: All passed

PERFORMANCE TESTS
[ ] Test 19-21: All passed

ISSUES FOUND:
1. _____________________
2. _____________________

NOTES:
_______________________
_______________________
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Connection Refused
```bash
Error: Failed to connect to localhost:3000
```
**Solution**: Ensure dev server is running
```bash
npm run dev
```

### Issue 2: 404 Not Found
```bash
{"message": "Not Found"}
```
**Solution**: Check URL spelling, ensure API route exists

### Issue 3: CORS Error (Browser)
```
Access to fetch blocked by CORS policy
```
**Solution**: This shouldn't happen on same domain. If testing from different domain, configure Next.js CORS.

### Issue 4: Validation Always Passes
**Solution**: Check if you're sending correct Content-Type header:
```bash
-H "Content-Type: application/json"
```

---

## ⚡ Quick Smoke Test (2 phút)

Nếu không có thời gian chạy full test suite:

```bash
#!/bin/bash
# Quick smoke test

echo "1. GET all products..."
curl -s "http://localhost:3000/api/products?limit=5" | jq 'length'

echo "2. Test pagination..."
curl -s "http://localhost:3000/api/products/paginated?page=1&limit=5" | jq '.pagination.page'

echo "3. Test validation..."
curl -s "http://localhost:3000/api/products?limit=0" | jq '.error'

echo "4. Test cache headers..."
curl -I "http://localhost:3000/api/products" 2>/dev/null | grep -i cache

echo "✅ Smoke test complete!"
```

Lưu thành `smoke-test.sh` và chạy:
```bash
bash smoke-test.sh
```

---

## 📈 Performance Benchmarking

### Apache Bench Test

```bash
# Install apache bench
sudo apt-get install apache2-utils  # Linux
brew install httpie  # Mac

# Run benchmark (100 requests, 10 concurrent)
ab -n 100 -c 10 "http://localhost:3000/api/products?limit=10"
```

**Mục tiêu:**
- Requests per second: > 50
- Time per request: < 200ms
- Failed requests: 0

### Load Test Script

```javascript
// load-test.js
async function loadTest(concurrency = 10, requests = 100) {
  const startTime = Date.now();
  const promises = [];

  for (let i = 0; i < requests; i++) {
    if (promises.length >= concurrency) {
      await Promise.race(promises);
    }

    const promise = fetch('http://localhost:3000/api/products?limit=10')
      .then(() => promises.splice(promises.indexOf(promise), 1));

    promises.push(promise);
  }

  await Promise.all(promises);

  const duration = (Date.now() - startTime) / 1000;
  console.log(`Completed ${requests} requests in ${duration}s`);
  console.log(`Rate: ${(requests / duration).toFixed(2)} req/s`);
}

// Run: node load-test.js
loadTest(10, 100);
```

---

**Document created by Backend Specialist**
**Last updated: 2026-02-06**
