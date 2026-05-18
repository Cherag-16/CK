'use client';

import { Header } from '@/components/header';
import { CachedProductsView } from '@/components/cached-products-view';
import { useState, useEffect } from 'react';
import type { User, AuthState } from '@/lib/types';
import { AuthService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function CachedProductsPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    showLoginModal: false,
  });

  useEffect(() => {
    const authService = AuthService.getInstance();
    const user = authService.getCurrentUser();
    setAuthState({ isAuthenticated: !!user, user, showLoginModal: false });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemsCount={0}
        wishlistItemsCount={0}
        onCartClick={() => {}}
        onProfileClick={() => router.push('/profile')}
        onWishlistClick={() => {}}
        onOrderHistoryClick={() => router.push('/orders')}
        user={authState.user}
        onLoginClick={() => setAuthState((prev) => ({ ...prev, showLoginModal: true }))}
        onLogout={() => {
          AuthService.getInstance().logout();
          setAuthState({ isAuthenticated: false, user: null, showLoginModal: false });
        }}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Product Caching Demo</h1>
          <p className="text-muted-foreground">
            This page demonstrates Redis caching in action. Watch how data is served from cache on subsequent loads!
          </p>
        </div>

        <CachedProductsView />

        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-bold">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-semibold mb-2">🚀 Performance Benefits</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Reduced database queries</li>
                <li>✓ Faster response times</li>
                <li>✓ Lower server load</li>
                <li>✓ Better user experience</li>
              </ul>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-semibold mb-2">🔧 Implementation Details</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ API: /api/products/cached</li>
                <li>✓ Cache TTL: 1 hour</li>
                <li>✓ Auto JSON serialization</li>
                <li>✓ Refresh option available</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12 bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">API Endpoints</h2>
          <div className="space-y-3 text-sm font-mono">
            <div>
              <p className="text-primary">GET /api/products/cached</p>
              <p className="text-muted-foreground">Get all cached products</p>
            </div>
            <div>
              <p className="text-primary">GET /api/products/cached?id=1</p>
              <p className="text-muted-foreground">Get specific product by ID</p>
            </div>
            <div>
              <p className="text-primary">GET /api/products/cached?refresh=true</p>
              <p className="text-muted-foreground">Bypass cache and get fresh data</p>
            </div>
            <div>
              <p className="text-primary">GET /api/products/cached?stats=true</p>
              <p className="text-muted-foreground">View cache statistics</p>
            </div>
            <div>
              <p className="text-primary">POST /api/products/cached</p>
              <p className="text-muted-foreground">Clear cache (action: clear-all | clear-product)</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
