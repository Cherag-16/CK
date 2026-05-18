"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { WishlistSidebar } from "@/components/wishlist-sidebar"
import { AuthModal } from "@/components/auth-modal" 
import { CheckoutFlow } from "@/components/checkout-flow"
import { categories, mockProducts } from "@/lib/mock-data"
import { AuthService } from "@/lib/auth"
import { StorageService } from "@/lib/storage"
import type { CartItem, WishlistItem, User, AuthState, Category, Product } from "@/lib/types"
 import { Card, CardContent } from "@/components/ui/card"

export default function CategoriesIndexPage() {
  const router = useRouter()

  const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false, user: null, showLoginModal: false })
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showWishlist, setShowWishlist] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
   
  const authService = AuthService.getInstance()
  const storageService = StorageService.getInstance()

  useEffect(() => {
    const user = authService.getCurrentUser()
    setAuthState({ isAuthenticated: !!user, user, showLoginModal: false })

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

  const getTotalCartItems = () => cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleAuthSuccess = (user: User) => {
    setAuthState({ isAuthenticated: true, user, showLoginModal: false })
    setCartItems(storageService.loadCart())
    setWishlistItems(storageService.loadWishlist())
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

  const buyNow = (product: Product) => {
    requireAuth(() => {
      addToCart(product)
      setShowCheckout(true)
    })
  }
  
  const toggleWishlist = (product: Product) => {
    const newItems = [...wishlistItems]
    const existingIndex = newItems.findIndex((item) => item.product.id === product.id)

    if (existingIndex >= 0) newItems.splice(existingIndex, 1)
    else
      newItems.push({
        id: `wishlist-${Date.now()}`,
        product,
        addedAt: new Date(),
      })

    setWishlistItems(newItems)
    storageService.saveWishlist(newItems)
  }

  const onCategoryClick = (category: Category) => {
    router.push(`/category/${category.slug}`)
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
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">Categories</h1>
          <p className="text-muted-foreground">Browse by category and discover products</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Card key={cat.id} className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden" onClick={() => onCategoryClick(cat)}>
              <div className="aspect-square bg-muted overflow-hidden">
                <img src={cat.image || "/placeholder.svg"} alt={cat.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </div>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <div className="font-semibold text-sm">{cat.name}</div>
                  <div className="text-xs text-muted-foreground">{cat.productCount} products</div>
                </div>
              </CardContent>
            </Card>
          ))}
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
        onCheckout={() =>
          requireAuth(() => {
            setShowCart(false)
            setShowCheckout(true)
          })
        }
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

      <AuthModal isOpen={authState.showLoginModal} onClose={() => setAuthState((prev) => ({ ...prev, showLoginModal: false }))} onAuthSuccess={handleAuthSuccess} />

      {authState.user && (
        <CheckoutFlow isOpen={showCheckout} onClose={() => setShowCheckout(false)} cartItems={cartItems} user={authState.user} onOrderComplete={() => {}} />
      )}
    </div>
  )
}
