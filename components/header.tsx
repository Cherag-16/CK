"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, Search, Heart, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchBar } from "./search-bar"
import { CKLogo } from "./ck-logo"
import type { User as UserType, Product } from "@/lib/types"

interface HeaderProps {
  cartItemsCount: number
  wishlistItemsCount?: number
  onCartClick: () => void
  onProfileClick?: () => void
  onWishlistClick?: () => void
  onOrderHistoryClick?: () => void
  user?: UserType | null
  onLoginClick?: () => void
  onLogout?: () => void
  onSearch?: (query: string, results: Product[]) => void
  onProductSelect?: (product: Product) => void
}

export function Header({
  cartItemsCount,
  wishlistItemsCount,
  onCartClick,
  onProfileClick,
  onWishlistClick,
  onOrderHistoryClick,
  user,
  onLoginClick,
  onLogout,
  onSearch,
  onProductSelect,
}: HeaderProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <CKLogo className="h-10 w-10" />
          <h1 className="text-2xl font-bold text-primary">CK</h1>
        </div>

        {/* Search Bar - Hidden on mobile */}
        {onSearch && (
          <SearchBar
            onSearch={onSearch}
            onProductSelect={onProductSelect}
            className="hidden md:flex flex-1 max-w-md mx-4"
          />
        )}

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden lg:flex items-center gap-6">
          <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </a>
          <a href="/category" className="text-sm font-medium hover:text-primary transition-colors">
            Categories
          </a>
          <a href="/deals" className="text-sm font-medium hover:text-primary transition-colors">
            Deals
          </a>
          <a href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          {onSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Wishlist */}
          <Button variant="ghost" size="icon" className="relative" onClick={onWishlistClick}>
            <Heart className="h-5 w-5" />
            {wishlistItemsCount && wishlistItemsCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {wishlistItemsCount}
              </Badge>
            )}
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" onClick={onCartClick}>
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {cartItemsCount}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {user?.avatar ? (
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-5 w-5 rounded-full" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onProfileClick ?? (() => router.push("/profile"))}>
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onOrderHistoryClick}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Order History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onWishlistClick}>
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Help & Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={onLoginClick}>
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && onSearch && (
        <div className="md:hidden border-t p-4">
          <SearchBar onSearch={onSearch} onProductSelect={onProductSelect} />
        </div>
      )}
    </header>
  )
}
