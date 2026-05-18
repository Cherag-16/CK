"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { mockProducts } from "@/lib/mock-data"
import type { WishlistItem, Product } from "@/lib/types"

export default function WishlistPage() {
  const router = useRouter()

  // Mock wishlist items - in real app this would come from state management
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: "wishlist-1",
      product: mockProducts[0],
      addedAt: new Date("2024-01-15"),
    },
    {
      id: "wishlist-2",
      product: mockProducts[1],
      addedAt: new Date("2024-01-20"),
    },
  ])

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const handleAddToCart = (product: Product) => {
    console.log("[v0] Adding to cart from wishlist:", product.name)
  }

  const handleBuyNow = (product: Product) => {
    console.log("[v0] Buy now from wishlist:", product.name)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shopping
          </Button>
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-red-500" />
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <Badge variant="secondary">{wishlistItems.length} items</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Heart className="h-24 w-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Discover amazing products and add them to your wishlist to save for later!
            </p>
            <Button onClick={() => router.push("/")}>Start Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => router.push(`/product/${item.product.id}`)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500"
                    onClick={() => removeFromWishlist(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {!item.product.inStock && (
                    <Badge className="absolute bottom-2 left-2 bg-destructive">Out of Stock</Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="text-xs mb-2">
                        {item.product.brand}
                      </Badge>
                      <h3
                        className="font-semibold text-lg line-clamp-2 cursor-pointer hover:text-primary"
                        onClick={() => router.push(`/product/${item.product.id}`)}
                      >
                        {item.product.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary">${item.product.price}</span>
                        {item.product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${item.product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Badge variant="secondary">{item.product.category}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">Added {item.addedAt.toLocaleDateString()}</p>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => handleAddToCart(item.product)}
                        disabled={!item.product.inStock}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => handleBuyNow(item.product)}
                        disabled={!item.product.inStock}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
