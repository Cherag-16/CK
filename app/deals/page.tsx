"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { ProductGrid } from "@/components/product-grid";
import { CartSidebar } from "@/components/cart-sidebar";
import { WishlistSidebar } from "@/components/wishlist-sidebar";
import { AuthModal } from "@/components/auth-modal";
import { CheckoutFlow } from "@/components/checkout-flow";
import { mockDeals, topDeals, cheapProducts } from "@/lib/mock-data";
import { AuthService } from "@/lib/auth";
import { StorageService } from "@/lib/storage";
import type {
  CartItem,
  WishlistItem,
  User,
  AuthState,
  Product,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DealsPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    showLoginModal: false,
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const authService = AuthService.getInstance();
  const storageService = StorageService.getInstance();

  useEffect(() => {
    const user = authService.getCurrentUser();
    setAuthState({ isAuthenticated: !!user, user, showLoginModal: false });

    if (user) {
      setCartItems(storageService.loadCart());
      setWishlistItems(storageService.loadWishlist());
    }
  }, []);

  const requireAuth = (action: () => void) => {
    if (!authState.isAuthenticated) {
      setAuthState((prev) => ({ ...prev, showLoginModal: true }));
      return;
    }
    action();
  };

  const getTotalCartItems = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleAuthSuccess = (user: User) => {
    setAuthState({ isAuthenticated: true, user, showLoginModal: false });
    setCartItems(storageService.loadCart());
    setWishlistItems(storageService.loadWishlist());
  };

  const addToCart = (product: Product) => {
    const newItems = [...cartItems];
    const existingItem = newItems.find(
      (item) => item.product.id === product.id,
    );
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      newItems.push({ product, quantity: 1 });
    }

    setCartItems(newItems);
    storageService.saveCart(newItems);
  };

  const buyNow = (product: Product) => {
    requireAuth(() => {
      addToCart(product);
      setShowCheckout(true);
    });
  };

  const toggleWishlist = (product: Product) => {
    const newItems = [...wishlistItems];
    const existingIndex = newItems.findIndex(
      (item) => item.product.id === product.id,
    );

    if (existingIndex >= 0) newItems.splice(existingIndex, 1);
    else
      newItems.push({
        id: `wishlist-${Date.now()}`,
        product,
        addedAt: new Date(),
      });

    setWishlistItems(newItems);
    storageService.saveWishlist(newItems);
  };

  const isWishlisted = (productId: string) => {
    return wishlistItems.some((item) => item.product.id === productId);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOngoing = (deal: any) => {
    const now = new Date();
    return deal.startDate <= now && now <= deal.endDate;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemsCount={getTotalCartItems()}
        wishlistItemsCount={wishlistItems.length}
        onCartClick={() => setShowCart(true)}
        onProfileClick={() => router.push("/profile")}
        onWishlistClick={() => setShowWishlist(true)}
        onOrderHistoryClick={() => router.push("/orders")}
        user={authState.user}
        onLoginClick={() =>
          setAuthState((prev) => ({ ...prev, showLoginModal: true }))
        }
        onLogout={() => {
          authService.logout();
          setAuthState({
            isAuthenticated: false,
            user: null,
            showLoginModal: false,
          });
          setCartItems([]);
          setWishlistItems([]);
        }}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-balance mb-2">
            Deals & Offers
          </h1>
          <p className="text-muted-foreground">
            Discover amazing deals and exclusive offers
          </p>
        </div>

        {/* Featured Deals */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockDeals.map((deal) => (
              <Card
                key={deal.id}
                className={`overflow-hidden ${isOngoing(deal) ? "border-primary border-2" : ""}`}
              >
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        {deal.discountValue}%
                      </div>
                      <div className="text-sm">OFF</div>
                    </div>
                  </div>
                  {isOngoing(deal) && (
                    <Badge className="absolute top-3 right-3 bg-green-500">
                      Live
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2">{deal.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {deal.description}
                  </p>
                  <div className="text-xs space-y-1">
                    <div>
                      <span className="font-medium">Start:</span>{" "}
                      {formatDate(deal.startDate)}
                    </div>
                    <div>
                      <span className="font-medium">End:</span>{" "}
                      {formatDate(deal.endDate)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Top Deals */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Top Deals - Big Discounts</h2>
          <ProductGrid
            products={topDeals}
            onAddToCart={addToCart}
            onBuyNow={buyNow}
            onToggleWishlist={toggleWishlist}
            isWishlisted={isWishlisted}
          />
        </div>

        {/* Budget Buys */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Budget Buys - Under $200</h2>
          <ProductGrid
            products={cheapProducts}
            onAddToCart={addToCart}
            onBuyNow={buyNow}
            onToggleWishlist={toggleWishlist}
            isWishlisted={isWishlisted}
          />
        </div>
      </main>

      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        onUpdateQuantity={(productId, quantity) => {
          const newItems = cartItems
            .map((item) =>
              item.product.id === productId ? { ...item, quantity } : item,
            )
            .filter((item) => item.quantity > 0);
          setCartItems(newItems);
          storageService.saveCart(newItems);
        }}
        onRemoveItem={(productId) => {
          const newItems = cartItems.filter(
            (item) => item.product.id !== productId,
          );
          setCartItems(newItems);
          storageService.saveCart(newItems);
        }}
        onCheckout={() =>
          requireAuth(() => {
            setShowCart(false);
            setShowCheckout(true);
          })
        }
      />

      <WishlistSidebar
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
        wishlistItems={wishlistItems}
        onRemoveItem={(productId) => {
          const newItems = wishlistItems.filter(
            (item) => item.product.id !== productId,
          );
          setWishlistItems(newItems);
          storageService.saveWishlist(newItems);
        }}
        onAddToCart={addToCart}
        onBuyNow={buyNow}
      />

      <AuthModal
        isOpen={authState.showLoginModal}
        onClose={() =>
          setAuthState((prev) => ({ ...prev, showLoginModal: false }))
        }
        onAuthSuccess={handleAuthSuccess}
      />

      {authState.user && (
        <CheckoutFlow
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          cartItems={cartItems}
          user={authState.user}
          onOrderComplete={() => { }}
        />
      )}
    </div>
  );
}
