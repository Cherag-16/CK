import { NextRequest, NextResponse } from 'next/server';
import { redisGet, redisSet, redisDel, redisExists } from '@/lib/redis';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';

const CACHE_TTL = 3600; // 1 hour
const PRODUCTS_CACHE_KEY = 'products:all';
const PRODUCT_CACHE_KEY_PREFIX = 'product:';

/**
 * GET /api/products/cached
 *
 * Query parameters:
 * - id: Get specific product by ID (with caching)
 * - refresh: Set to 'true' to bypass cache and refresh
 * - stats: Set to 'true' to get cache statistics
 *
 * Examples:
 * GET /api/products/cached  (get all cached products)
 * GET /api/products/cached?id=1  (get single product)
 * GET /api/products/cached?id=1&refresh=true  (bypass cache)
 * GET /api/products/cached?stats=true  (get cache info)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('id');
    const refresh = searchParams.get('refresh') === 'true';
    const stats = searchParams.get('stats') === 'true';

    // Get cache statistics
    if (stats) {
      return getCacheStats();
    }

    // Get single product by ID
    if (productId) {
      return getSingleProductCached(productId, refresh);
    }

    // Get all products
    return getAllProductsCached(refresh);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Get all products with caching
 */
async function getAllProductsCached(refresh: boolean) {
  // Check cache first (unless refresh is requested)
  if (!refresh) {
    const cached = await redisGet<Product[]>(PRODUCTS_CACHE_KEY);
    if (cached) {
      return NextResponse.json({
        products: cached,
        source: 'cache',
        message: 'Retrieved from Redis cache',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Cache miss or refresh requested - fetch from mock data
  console.log('Cache miss for products - fetching from mock data');

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Store in cache for 1 hour
  await redisSet(PRODUCTS_CACHE_KEY, mockProducts, CACHE_TTL);

  return NextResponse.json({
    products: mockProducts,
    source: 'fresh',
    message: 'Retrieved from database and cached',
    cacheTTL: CACHE_TTL,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Get single product by ID with caching
 */
async function getSingleProductCached(productId: string, refresh: boolean) {
  const cacheKey = `${PRODUCT_CACHE_KEY_PREFIX}${productId}`;

  // Check cache first
  if (!refresh) {
    const cached = await redisGet<Product>(cacheKey);
    if (cached) {
      return NextResponse.json({
        product: cached,
        source: 'cache',
        message: `Product ${productId} retrieved from cache`,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Find product from mock data
  const product = mockProducts.find((p) => p.id === productId);

  if (!product) {
    return NextResponse.json(
      { error: `Product with ID ${productId} not found` },
      { status: 404 }
    );
  }

  // Cache for 1 hour
  await redisSet(cacheKey, product, CACHE_TTL);

  return NextResponse.json({
    product,
    source: 'fresh',
    message: `Product ${productId} retrieved from database and cached`,
    cacheTTL: CACHE_TTL,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Get cache statistics
 */
async function getCacheStats() {
  const productsExists = await redisExists(PRODUCTS_CACHE_KEY);
  const cachedProducts = await redisGet<Product[]>(PRODUCTS_CACHE_KEY);

  const stats = {
    allProductsCached: productsExists,
    totalProducts: mockProducts.length,
    cachedProductCount: cachedProducts ? cachedProducts.length : 0,
    cacheTTL: CACHE_TTL,
    cacheKeys: {
      allProducts: PRODUCTS_CACHE_KEY,
      singleProductPattern: `${PRODUCT_CACHE_KEY_PREFIX}{productId}`,
    },
    exampleQueries: [
      '/api/products/cached (get all)',
      '/api/products/cached?id=1 (get single)',
      '/api/products/cached?id=1&refresh=true (bypass cache)',
      '/api/products/cached?stats=true (this response)',
    ],
  };

  return NextResponse.json(stats);
}

/**
 * POST /api/products/cached
 *
 * Clear cache
 * Body: { action: 'clear-all' | 'clear-products' | 'clear-product', productId?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, productId } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Missing action parameter' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'clear-all':
        await redisDel(PRODUCTS_CACHE_KEY);
        return NextResponse.json({
          success: true,
          message: 'All products cache cleared',
        });

      case 'clear-product':
        if (!productId) {
          return NextResponse.json(
            { error: 'Missing productId for clear-product action' },
            { status: 400 }
          );
        }
        const count = await redisDel(`${PRODUCT_CACHE_KEY_PREFIX}${productId}`);
        return NextResponse.json({
          success: true,
          message: `Product ${productId} cache cleared`,
          deletedCount: count,
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
