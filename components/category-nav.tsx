"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { categories } from "@/lib/mock-data"

interface CategoryNavProps {
  selectedCategory: string | null
  onCategorySelect: (categorySlug: string | null) => void
}

export function CategoryNav({ selectedCategory, onCategorySelect }: CategoryNavProps) {
  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => onCategorySelect(null)}
            className="whitespace-nowrap"
          >
            All Products
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.slug ? "default" : "outline"}
              size="sm"
              onClick={() => onCategorySelect(category.slug)}
              className="whitespace-nowrap flex items-center gap-2"
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
              <Badge variant="secondary" className="ml-1">
                {category.productCount}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
