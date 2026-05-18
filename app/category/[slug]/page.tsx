"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { CartSidebar } from "@/components/cart-sidebar"
import { WishlistSidebar } from "@/components/wishlist-sidebar"
import { AuthModal } from "@/components/auth-modal"
import { CheckoutFlow } from "@/components/checkout-flow"
import { mockProducts, categories } from "@/lib/mock-data"
import { AuthService } from "@/lib/auth"
import { StorageService } from "@/lib/storage"
import type { Product, CartItem, WishlistItem, User, AuthState, SearchFilters } from "@/lib/types"

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    showLoginModal: false,
  })
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showWishlist, setShowWishlist] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  const authService = AuthService.getInstance()
  const storageService = StorageService.getInstance()

  const category = categories.find((cat) => cat.slug === slug)
  const categoryProducts = mockProducts.filter(
    (product) => product.category.toLowerCase().replace(/[^a-z0-9]/g, "-") === slug,
  )

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

  useEffect(() => {
    let results = [...categoryProducts]

    // Apply filters
    if (filters.priceRange) {
      results = results.filter(
        (product) => product.price >= filters.priceRange![0] && product.price <= filters.priceRange![1],
      )
    }

    if (filters.inStock) {
      results = results.filter((product) => product.inStock)
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          results.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          results.sort((a, b) => b.price - a.price)
          break
        case "rating":
          results.sort((a, b) => b.rating - a.rating)
          break
        case "newest":
          results.sort((a, b) => b.id.localeCompare(a.id))
          break
      }
    }

    setFilteredProducts(results)
  }, [categoryProducts, filters])

  const requireAuth = (action: () => void) => {
    if (!authState.isAuthenticated) {
      setAuthState((prev) => ({ ...prev, showLoginModal: true }))
      return
    }
    action()
  }

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

  const buyNow = (product: Product) => {
    requireAuth(() => {
      const newItems = [...cartItems]
      const existingItem = newItems.find((item) => item.product.id === product.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        newItems.push({ product, quantity: 1 })
      }

      setCartItems(newItems)
      storageService.saveCart(newItems)
      setShowCheckout(true)
    })
  }

  const isWishlisted = (productId: string) => {
    return wishlistItems.some((item) => item.product.id === productId)
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

  const handleCheckout = () => {
    requireAuth(() => {
      setShowCart(false)
      setShowCheckout(true)
    })
  }

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  if (!category) {
    return <div>Category not found</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemsCount={getTotalCartItems()}
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
        wishlistItemsCount={wishlistItems.length}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <button onClick={() => router.push("/")} className="hover:text-foreground">
              Home
            </button>
            <span>/</span>
            <button onClick={() => router.push("/category")} className="hover:text-foreground">
              Category
            </button>
            <span>/</span>
            <span>{category.name}</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{category.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-balance">{category.name}</h1>
              <p className="text-muted-foreground">{filteredProducts.length} products available</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProductFilters filters={filters} onFiltersChange={setFilters} onClearFilters={() => setFilters({})} />
          </div>

          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <ProductGrid
                products={filteredProducts}
                onAddToCart={addToCart}
                onBuyNow={buyNow}
                onToggleWishlist={toggleWishlist}
                isWishlisted={isWishlisted}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">No products found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        onUpdateQuantity={(productId, quantity) => {
          const newItems = cartItems
            .map((item) => (item.product.id === productId ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0)
          setCartItems(newItems)
          storageService.saveCart(newItems)
        }}
        onRemoveItem={(productId) => {
          const newItems = cartItems.filter((item) => item.product.id !== productId)
          setCartItems(newItems)
          storageService.saveCart(newItems)
        }}
        onCheckout={handleCheckout}
      />

      <WishlistSidebar
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
        wishlistItems={wishlistItems}
        onRemoveItem={(productId) => {
          const newItems = wishlistItems.filter((item) => item.product.id !== productId)
          setWishlistItems(newItems)
          storageService.saveWishlist(newItems)
        }}
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
          onOrderComplete={() => {
            setShowCheckout(false)
            // Handle order completion
          }}
        />
      )}
    </div>
  )
}
