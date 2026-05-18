"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { WishlistSidebar } from "@/components/wishlist-sidebar"
import { AuthService } from "@/lib/auth"
import { StorageService } from "@/lib/storage"
import type { CartItem, WishlistItem, User, AuthState } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Award, Users, Globe, Heart } from "lucide-react"

export default function AboutPage() {
  const router = useRouter()

  const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false, user: null, showLoginModal: false })
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showWishlist, setShowWishlist] = useState(false)

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

  const getTotalCartItems = () => cartItems.reduce((total, item) => total + item.quantity, 0)

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

      <main className="container mx-auto px-4 p y-8">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-balance mb-4">About CK</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Welcome to CK - Your trusted online shopping destination for premium products at unbeatable prices. We're committed to bringing you the best shopping experience.
          </p>
        </div>

        {/* About Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Our Story */}
          <Card>
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                CK was founded with a simple mission: to make quality products accessible to everyone. What started as a small e-commerce platform has grown into a trusted marketplace serving thousands of customers.
              </p>
              <p>
                We believe in transparency, quality, and customer satisfaction. Every product on our platform is carefully selected to ensure it meets our high standards.
              </p>
              <p>
                Today, we offer a wide range of products across multiple categories - from electronics and computers to fashion, home decor, and kitchen appliances.
              </p>
            </CardContent>
          </Card>

          {/* Our Values */}
          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Award className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Quality First</h4>
                  <p className="text-sm text-muted-foreground">We only sell authentic, high-quality products.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Users className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Customer Focused</h4>
                  <p className="text-sm text-muted-foreground">Your satisfaction is our top priority.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Globe className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Global Reach</h4>
                  <p className="text-sm text-muted-foreground">We serve customers worldwide with fast delivery.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Why Choose CK?</CardTitle>
          </CardHeader>
          <CardContent> 
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center"> 
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <p className="text-muted-foreground">Products Available</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">100K+</div>
                <p className="text-muted-foreground">Happy Customers</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-muted-foreground">Customer Support</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-2">Best Prices</h4>
              <p className="text-sm text-muted-foreground">Competitive prices on all products with regular discounts.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Award className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-2">Quality Assured</h4>
              <p className="text-sm text-muted-foreground">All products verified and quality checked before delivery.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-2">Fast Shipping</h4>
              <p className="text-sm text-muted-foreground">Quick and reliable delivery to your doorstep.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-2">Great Support</h4>
              <p className="text-sm text-muted-foreground">Friendly customer support ready to help anytime.</p>
            </CardContent>
          </Card>
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
        onCheckout={() => setShowCart(false)}
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
        onAddToCart={() => {}}
        onBuyNow={() => {}}
      />
    </div>
  )
}
