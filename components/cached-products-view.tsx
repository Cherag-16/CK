'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function CachedProductsView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'cache' | 'fresh'>('fresh');
  const [lastFetch, setLastFetch] = useState<string>('');

  const fetchProducts = async (refresh = false) => {
    setLoading(true);
    try {
      const url = `/api/products/cached${refresh ? '?refresh=true' : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.products) {
        setProducts(data.products);
        setSource(data.source);
        setLastFetch(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cached Products</h2>
          <p className="text-sm text-muted-foreground">
            Last fetched: {lastFetch}
            <span
              className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                source === 'cache'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {source === 'cache' ? '⚡ From Cache' : '📡 Fresh Data'}
            </span>
          </p>
        </div>
        <Button onClick={() => fetchProducts(true)}>Refresh Data</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 6).map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-muted overflow-hidden">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{product.brand}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm line-through text-muted-foreground">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                <Button className="w-full mt-2" variant="outline">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="bg-muted p-4 rounded-lg text-sm">
        <p className="font-semibold mb-2">💡 How caching works:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>First load fetches from database (shows 📡 Fresh Data)</li>
          <li>Subsequent loads within 1 hour come from Redis cache (⚡ From Cache)</li>
          <li>Click "Refresh Data" to bypass cache and fetch fresh</li>
          <li>This improves performance and reduces database load</li>
        </ul>
      </div>
    </div>
  );
}
