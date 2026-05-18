import type { CartItem, WishlistItem } from "./types"

export class StorageService {
  private static instance: StorageService

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  saveCart(items: CartItem[]): void {
    try {
      localStorage.setItem("ck_cart", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save cart:", error)
    }
  }

  loadCart(): CartItem[] {
    try {
      const stored = localStorage.getItem("ck_cart")
      if (stored) {
        const parsed = JSON.parse(stored)
        // Validate the data structure
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) =>
              item.product &&
              typeof item.product.id === "string" &&
              typeof item.quantity === "number" &&
              item.quantity > 0,
          )
        }
      }
    } catch (error) {
      console.error("Failed to load cart:", error)
    }
    return []
  }

  clearCart(): void {
    try {
      localStorage.removeItem("ck_cart")
    } catch (error) {
      console.error("Failed to clear cart:", error)
    }
  }

  saveWishlist(items: WishlistItem[]): void {
    try {
      localStorage.setItem("ck_wishlist", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save wishlist:", error)
    }
  }

  loadWishlist(): WishlistItem[] {
    try {
      const stored = localStorage.getItem("ck_wishlist")
      if (stored) {
        const parsed = JSON.parse(stored)
        // Validate the data structure
        if (Array.isArray(parsed)) {
          return parsed.filter((item) => item.product && typeof item.product.id === "string" && item.id && item.addedAt)
        }
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error)
    }
    return []
  }

  clearWishlist(): void {
    try {
      localStorage.removeItem("ck_wishlist")
    } catch (error) {
      console.error("Failed to clear wishlist:", error)
    }
  }

  saveSearchHistory(searches: string[]): void {
    try {
      localStorage.setItem("ck_search_history", JSON.stringify(searches))
    } catch (error) {
      console.error("Failed to save search history:", error)
    }
  }

  loadSearchHistory(): string[] {
    try {
      const stored = localStorage.getItem("ck_search_history")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          return parsed.filter((item) => typeof item === "string" && item.trim().length > 0)
        }
      }
    } catch (error) {
      console.error("Failed to load search history:", error)
    }
    return []
  }

  addToSearchHistory(query: string): void {
    if (!query.trim()) return

    try {
      const history = this.loadSearchHistory()
      const filtered = history.filter((item) => item.toLowerCase() !== query.toLowerCase())
      const updated = [query.trim(), ...filtered].slice(0, 10) // Keep last 10 searches
      this.saveSearchHistory(updated)
    } catch (error) {
      console.error("Failed to add to search history:", error)
    }
  }

  saveUserPreferences(preferences: Record<string, any>): void {
    try {
      localStorage.setItem("ck_user_preferences", JSON.stringify(preferences))
    } catch (error) {
      console.error("Failed to save user preferences:", error)
    }
  }

  loadUserPreferences(): Record<string, any> {
    try {
      const stored = localStorage.getItem("ck_user_preferences")
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error("Failed to load user preferences:", error)
    }
    return {}
  }

  saveRecentlyViewed(productIds: string[]): void {
    try {
      const limited = productIds.slice(0, 20) // Keep last 20 viewed products
      localStorage.setItem("ck_recently_viewed", JSON.stringify(limited))
    } catch (error) {
      console.error("Failed to save recently viewed:", error)
    }
  }

  loadRecentlyViewed(): string[] {
    try {
      const stored = localStorage.getItem("ck_recently_viewed")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          return parsed.filter((id) => typeof id === "string")
        }
      }
    } catch (error) {
      console.error("Failed to load recently viewed:", error)
    }
    return []
  }

  addToRecentlyViewed(productId: string): void {
    if (!productId) return

    try {
      const recent = this.loadRecentlyViewed()
      const filtered = recent.filter((id) => id !== productId)
      const updated = [productId, ...filtered].slice(0, 20)
      this.saveRecentlyViewed(updated)
    } catch (error) {
      console.error("Failed to add to recently viewed:", error)
    }
  }

  clearAllUserData(): void {
    try {
      localStorage.removeItem("ck_cart")
      localStorage.removeItem("ck_wishlist")
      localStorage.removeItem("ck_search_history")
      localStorage.removeItem("ck_user_preferences")
      localStorage.removeItem("ck_recently_viewed")
      localStorage.removeItem("ck_user")
    } catch (error) {
      console.error("Failed to clear user data:", error)
    }
  }

  exportUserData(): string {
    try {
      const data = {
        cart: this.loadCart(),
        wishlist: this.loadWishlist(),
        searchHistory: this.loadSearchHistory(),
        preferences: this.loadUserPreferences(),
        recentlyViewed: this.loadRecentlyViewed(),
        exportDate: new Date().toISOString(),
      }
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error("Failed to export user data:", error)
      return "{}"
    }
  }
}
