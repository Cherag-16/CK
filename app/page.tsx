"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
// Category navigation moved to dedicated page
import { HeroSection } from "@/components/hero-section"
import { ProductGrid } from "@/components/product-grid"
import { CartSidebar } from "@/components/cart-sidebar"
import { WishlistSidebar } from "@/components/wishlist-sidebar"
import { AuthModal } from "@/components/auth-modal"
import { CheckoutFlow } from "@/components/checkout-flow"
import { PackingAnimation } from "@/components/packing-animation"
import { OrderSuccess } from "@/components/order-success"
import { OrderTracking } from "@/components/order-tracking"
import { mockProducts } from "@/lib/mock-data"
import { AuthService } from "@/lib/auth"
import { StorageService } from "@/lib/storage"
import type { Product, CartItem, OrderStatus, WishlistItem, User, AuthState } from "@/lib/types"

export default function HomePage() {
  const router = useRouter()

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    showLoginModal: false,
  })

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showWishlist, setShowWishlist] = useState(false)
  const [showTracking, setShowTracking] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [orderStatus, setOrderStatus] = useState<OrderStatus>({
    isOrdering: false,
    isComplete: false,
    showAnimation: false,
  })

  const authService = AuthService.getInstance()
  const storageService = StorageService.getInstance()

  useEffect(() => {
    const user = authService.getCurrentUser()
    setAuthState({
      isAuthenticated: !!user,
      user,
      showLoginModal: false,
    })

    if (user) {
      setCartItems(storageService.loadCart())
      setWishlistItems(storageService.loadWishlist())
    }
  }, [])

  const requireAuth = (action: () => void) => {
    if (!authState.isAuthenticated) {
      setAuthState((prev) => ({ ...prev, showLoginModal: true }))
      return
    }
    action()
  }

  const filteredProducts = selectedCategory
    ? mockProducts.filter((product) => product.category.toLowerCase().replace(/[^a-z0-9]/g, "-") === selectedCategory)
    : mockProducts.slice(0, 12) // Show only first 12 products on home page

  const addToCart = (product: Product) => {
    const newItems = [...cartItems]
    const existingItem = newItems.find((item) => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      newItems.push({ product, quantity: 1 })
    }

    setCartItems(newItems)
    storageService.saveCart(newItems)
  }

  const toggleWishlist = (product: Product) => {
    const newItems = [...wishlistItems]
    const existingIndex = newItems.findIndex((item) => item.product.id === product.id)

    if (existingIndex >= 0) {
      newItems.splice(existingIndex, 1)
    } else {
      newItems.push({
        id: `wishlist-${Date.now()}`,
        product,
        addedAt: new Date(),
      })
    }

    setWishlistItems(newItems)
    storageService.saveWishlist(newItems)
  }

  const isWishlisted = (productId: string) => {
    return wishlistItems.some((item) => item.product.id === productId)
  }

  const removeFromWishlist = (productId: string) => {
    const newItems = wishlistItems.filter((item) => item.product.id !== productId)
    setWishlistItems(newItems)
    storageService.saveWishlist(newItems)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeItem(productId)
      return
    }
    const newItems = cartItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    setCartItems(newItems)
    storageService.saveCart(newItems)
  }

  const removeItem = (productId: string) => {
    const newItems = cartItems.filter((item) => item.product.id !== productId)
    setCartItems(newItems)
    storageService.saveCart(newItems)
  }

  const buyNow = (product: Product) => {
    requireAuth(() => {
      addToCart(product)
      setShowCheckout(true)
    })
  }

  const handleCheckout = () => {
    requireAuth(() => {
      setShowCart(false)
      setShowCheckout(true)
    })
  }

  const handleCheckoutComplete = () => {
    setShowCheckout(false)
    setOrderStatus({ isOrdering: true, isComplete: false, showAnimation: true })
  }

  const handleAnimationComplete = () => {
    setOrderStatus({ isOrdering: false, isComplete: true, showAnimation: false })
    setCartItems([])
    storageService.clearCart()
  }

  const handleContinueShopping = () => {
    setOrderStatus({ isOrdering: false, isComplete: false, showAnimation: false })
  }

  const handleTrackOrder = () => {
    setOrderStatus({ isOrdering: false, isComplete: false, showAnimation: false })
    setShowTracking(true)
  }

  const handleAuthSuccess = (user: User) => {
    setAuthState({
      isAuthenticated: true,
      user,
      showLoginModal: false,
    })
    setCartItems(storageService.loadCart())
    setWishlistItems(storageService.loadWishlist())
  }

  const handleSearch = (query: string, results: Product[]) => {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleProductSelect = (product: Product) => {
    router.push(`/product/${product.id}`)
  }

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

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
        onLoginClick={() => setAuthState((prev) => ({ ...prev, showLoginModal: true }))}
        onLogout={() => {
          authService.logout()
          setAuthState({ isAuthenticated: false, user: null, showLoginModal: false })
          setCartItems([])
          setWishlistItems([])
        }}
        onSearch={handleSearch}
        onProductSelect={handleProductSelect}
      />

      {/* Categories moved to /category page; CategoryNav removed from home */}

      {!selectedCategory && <HeroSection />}

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-balance mb-2">
            {selectedCategory ? `${selectedCategory.replace("-", " ")} Products` : "Featured Products"}
          </h2>
          <p className="text-muted-foreground text-pretty">
            {selectedCategory
              ? `Discover our premium ${selectedCategory.replace("-", " ")} collection`
              : "Discover our premium collection of carefully curated products"}
          </p>
        </div>

        <ProductGrid
          products={filteredProducts}
          onAddToCart={addToCart}
          onBuyNow={buyNow}
          onToggleWishlist={toggleWishlist}
          isWishlisted={isWishlisted}
        />
      </main>

      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />

      <WishlistSidebar
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
        wishlistItems={wishlistItems}
        onRemoveItem={removeFromWishlist}
        onAddToCart={addToCart}
        onBuyNow={buyNow}
      />

      <AuthModal
        isOpen={authState.showLoginModal}
        onClose={() => setAuthState((prev) => ({ ...prev, showLoginModal: false }))}
        onAuthSuccess={handleAuthSuccess}
      />

      {authState.user && (
        <CheckoutFlow
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          cartItems={cartItems}
          user={authState.user}
          onOrderComplete={handleCheckoutComplete}
        />
      )}

      <PackingAnimation isVisible={orderStatus.showAnimation} onComplete={handleAnimationComplete} />

      <OrderSuccess
        isVisible={orderStatus.isComplete}
        onContinueShopping={handleContinueShopping}
        onTrackOrder={handleTrackOrder}
      />

      <OrderTracking isVisible={showTracking} onClose={() => setShowTracking(false)} />
    </div>
  )
}
