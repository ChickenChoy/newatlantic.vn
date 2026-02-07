/**
 * Integration Tests for Products API
 * Tests for the optimized /api/products endpoint
 */

import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/products/route';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '@/lib/db-supabase';
import { logActivity } from '@/lib/activity-logs';
import { revalidatePath } from 'next/cache';
import type { Product } from '@/types';

// Mock dependencies
jest.mock('@/lib/db-supabase');
jest.mock('@/lib/activity-logs');
jest.mock('next/cache');

const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;
const mockGetProductById = getProductById as jest.MockedFunction<typeof getProductById>;
const mockAddProduct = addProduct as jest.MockedFunction<typeof addProduct>;
const mockUpdateProduct = updateProduct as jest.MockedFunction<typeof updateProduct>;
const mockDeleteProduct = deleteProduct as jest.MockedFunction<typeof deleteProduct>;
const mockLogActivity = logActivity as jest.MockedFunction<typeof logActivity>;
const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>;

// Helper function to create mock NextRequest
function createMockRequest(url: string, options: RequestInit = {}): NextRequest {
  const parsedUrl = new URL(url);
  const request = {
    url,
    method: options.method || 'GET',
    headers: new Headers(options.headers),
    nextUrl: parsedUrl,
    cookies: {
      get: jest.fn(),
      getAll: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      has: jest.fn(),
      clear: jest.fn(),
    },
    geo: undefined,
    ip: undefined,
    json: async () => options.body ? JSON.parse(options.body as string) : {},
  };
  return request as unknown as NextRequest;
}

describe('Products API - Pagination Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProducts.mockResolvedValue([]);
  });

  it('should support limit parameter', async () => {
    const request = createMockRequest('http://localhost:3000/api/products?limit=2');

    await GET(request);

    expect(mockGetProducts).toHaveBeenCalledWith({
      limit: 2,
      offset: 0,
      category: undefined,
    });
  });

  it('should support page parameter and calculate offset correctly', async () => {
    const request = createMockRequest('http://localhost:3000/api/products?limit=10&page=3');

    await GET(request);

    expect(mockGetProducts).toHaveBeenCalledWith({
      limit: 10,
      offset: 20, // (page - 1) * limit = (3 - 1) * 10
      category: undefined,
    });
  });

  it('should support category filtering', async () => {
    const request = createMockRequest('http://localhost:3000/api/products?category=electronics');

    await GET(request);

    expect(mockGetProducts).toHaveBeenCalledWith({
      limit: 50,
      offset: 0,
      category: 'electronics',
    });
  });

  it('should validate limit parameter (max 100)', async () => {
    const request = createMockRequest('http://localhost:3000/api/products?limit=150');

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain('limit');
  });

  it('should validate page parameter (minimum 1)', async () => {
    const request = createMockRequest('http://localhost:3000/api/products?page=0');

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain('page');
  });

  it('should use default values when no parameters provided', async () => {
    const request = createMockRequest('http://localhost:3000/api/products');

    await GET(request);

    expect(mockGetProducts).toHaveBeenCalledWith({
      limit: 50,
      offset: 0,
      category: undefined,
    });
  });
});

describe('Products API - Cache Headers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProducts.mockResolvedValue([]);
  });

  it('should include cache-control headers in response', async () => {
    const request = createMockRequest('http://localhost:3000/api/products');

    const response = await GET(request);

    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toBeTruthy();
    expect(cacheControl).toContain('s-maxage');
    expect(cacheControl).toContain('stale-while-revalidate');
  });
});

describe('Products API - N+1 Query Prevention', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('PUT should use getProductById instead of getProducts', async () => {
    const mockProduct: Product = {
      id: '123',
      name: 'Test Product',
      slug: 'test-product',
      description: 'Test',
      category: 'electronics',
      categoryName: 'Electronics',
      image: '/images/test.jpg',
      images: [],
      price: '100',
      createdAt: new Date().toISOString(),
    };

    mockGetProductById.mockResolvedValue(mockProduct);
    mockUpdateProduct.mockResolvedValue(true);

    const request = createMockRequest('http://localhost:3000/api/products', {
      method: 'PUT',
      body: JSON.stringify({ id: '123', name: 'Updated Product' }),
    });

    await PUT(request);

    expect(mockGetProductById).toHaveBeenCalledWith('123');
    expect(mockGetProducts).not.toHaveBeenCalled();
  });

  it('DELETE should use getProductById instead of getProducts', async () => {
    const mockProduct: Product = {
      id: '123',
      name: 'Test Product',
      slug: 'test-product',
      description: 'Test',
      category: 'electronics',
      categoryName: 'Electronics',
      image: '/images/test.jpg',
      images: [],
      price: '100',
      createdAt: new Date().toISOString(),
    };

    mockGetProductById.mockResolvedValue(mockProduct);
    mockDeleteProduct.mockResolvedValue(true);

    const request = createMockRequest('http://localhost:3000/api/products?id=123', {
      method: 'DELETE',
    });

    await DELETE(request);

    expect(mockGetProductById).toHaveBeenCalledWith('123');
    expect(mockGetProducts).not.toHaveBeenCalled();
  });
});

describe('Products API - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle database errors gracefully in GET', async () => {
    mockGetProducts.mockRejectedValue(new Error('Database connection failed'));

    const request = createMockRequest('http://localhost:3000/api/products');
    const response = await GET(request);

    expect(response.status).toBe(500);
  });

  it('should return 404 when product not found in PUT', async () => {
    mockGetProductById.mockResolvedValue(null);

    const request = createMockRequest('http://localhost:3000/api/products', {
      method: 'PUT',
      body: JSON.stringify({ id: '999', name: 'Updated Product' }),
    });

    const response = await PUT(request);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toContain('not found');
  });

  it('should return 404 when product not found in DELETE', async () => {
    mockGetProductById.mockResolvedValue(null);

    const request = createMockRequest('http://localhost:3000/api/products?id=999', {
      method: 'DELETE',
    });

    const response = await DELETE(request);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toContain('not found');
  });

  it('should validate required fields in POST', async () => {
    const request = createMockRequest('http://localhost:3000/api/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' }), // Missing required fields
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});

describe('Products API - Activity Logging', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLogActivity.mockResolvedValue(null);
  });

  it('should log activity when creating a product', async () => {
    const newProduct = {
      name: 'New Product',
      slug: 'new-product',
      description: 'Description',
      category: 'electronics',
      price: '100',
      images: [],
    };

    mockAddProduct.mockResolvedValue(true);

    const request = createMockRequest('http://localhost:3000/api/products', {
      method: 'POST',
      body: JSON.stringify(newProduct),
    });

    await POST(request);

    expect(mockLogActivity).toHaveBeenCalled();
  });

  it('should revalidate path after creating a product', async () => {
    const newProduct = {
      name: 'New Product',
      slug: 'new-product',
      description: 'Description',
      category: 'electronics',
      price: '100',
      images: [],
    };

    mockAddProduct.mockResolvedValue(true);

    const request = createMockRequest('http://localhost:3000/api/products', {
      method: 'POST',
      body: JSON.stringify(newProduct),
    });

    await POST(request);

    expect(mockRevalidatePath).toHaveBeenCalledWith('/shop');
  });
});
