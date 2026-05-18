"use client"

import { X, Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { WishlistItem, Product } from "@/lib/types"

interface WishlistSidebarProps {
  isOpen: boolean
  onClose: () => void
  wishlistItems: WishlistItem[]
  onRemoveItem: (productId: string) => void
  onAddToCart: (product: Product) => void
  onBuyNow: (product: Product) => void
}

export function WishlistSidebar({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveItem,
  onAddToCart,
  onBuyNow,
}: WishlistSidebarProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold">My Wishlist</h2>
              <Badge variant="secondary">{wishlistItems.length}</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            {wishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground text-sm">
                  Add products you love to your wishlist and shop them later!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                    <div className="relative">
                      <img
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      {!item.product.inStock && (
                        <Badge className="absolute -top-1 -right-1 text-xs bg-destructive">Out</Badge>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">{item.product.name}</h4>
                      <p className="text-lg font-bold text-primary mb-2">${item.product.price}</p>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs bg-transparent"
                          onClick={() => onAddToCart(item.product)}
                          disabled={!item.product.inStock}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Add to Cart
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => onBuyNow(item.product)}
                          disabled={!item.product.inStock}
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {wishlistItems.length > 0 && (
            <>
              <Separator />
              <div className="p-4">
                <div className="text-center text-sm text-muted-foreground mb-3">
                  {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} in your wishlist
                </div>
                <Button className="w-full" onClick={onClose}>
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
