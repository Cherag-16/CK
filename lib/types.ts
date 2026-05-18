export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  description: string
  detailedDescription: string
  category: string
  brand: string
  inStock: boolean
  stockCount: number
  rating: number
  reviewCount: number
  features: string[]
  specifications: Record<string, string>
  reviews?: ProductReview[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderStatus {
  isOrdering: boolean
  isComplete: boolean
  showAnimation: boolean
}

export interface Order {
  id: string
  orderNumber: string
  items: CartItem[]
  totalAmount: number
  status: "processing" | "shipped" | "delivered"
  createdAt: Date
  estimatedDelivery: Date
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  joinedDate: Date
  addresses: Address[]
}

export interface Address {
  id: string
  type: "home" | "work" | "other"
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  showLoginModal: boolean
}

export interface SearchFilters {
  category?: string
  priceRange?: [number, number]
  sortBy?: "price-low" | "price-high" | "rating" | "newest"
  inStock?: boolean
}

export interface WishlistItem {
  id: string
  product: Product
  addedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  image?: string
  productCount: number
}

export interface ProductReview {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: Date
}
