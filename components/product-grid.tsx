"use client"

import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  onBuyNow: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  isWishlisted?: (productId: string) => boolean
}

export function ProductGrid({ products, onAddToCart, onBuyNow, onToggleWishlist, isWishlisted }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
          onToggleWishlist={onToggleWishlist}
          isWishlisted={isWishlisted?.(product.id)}
        />
      ))}
    </div>
  )
}
