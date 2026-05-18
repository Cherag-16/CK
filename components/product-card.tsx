"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Star } from "lucide-react"
import type { Product } from "@/lib/types"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onBuyNow: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  isWishlisted?: boolean
}

export function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const handleProductClick = () => {
    router.push(`/product/${product.id}`)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden" onClick={handleProductClick}>
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className={`w-full h-64 object-cover transition-transform duration-300 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />

        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="icon"
            className={`bg-white/80 hover:bg-white transition-colors ${
              isWishlisted ? "text-red-500" : "text-gray-600"
            }`}
            onClick={(e) => {
              e.stopPropagation()
              onToggleWishlist?.(product)
            }}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </Button>
        </div>

        {product.originalPrice && (
          <Badge className="absolute top-3 left-3 bg-destructive">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </Badge>
        )}

        {!product.inStock && <Badge className="absolute bottom-3 left-3 bg-destructive">Out of Stock</Badge>}
      </div>

      <CardContent className="p-4" onClick={handleProductClick}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {product.brand}
            </Badge>
            <div className="flex items-center gap-1">
              {renderStars(product.rating)}
              <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-semibold text-lg line-clamp-2 text-balance">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>
            <Badge variant="secondary">{product.category}</Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          className="flex-1 bg-transparent"
          onClick={(e) => {
            e.stopPropagation()
            onAddToCart(product)
          }}
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
        <Button
          className="flex-1 bg-accent hover:bg-accent/90"
          onClick={(e) => {
            e.stopPropagation()
            onBuyNow(product)
          }}
          disabled={!product.inStock}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  )
}
