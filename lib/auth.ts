import type { User } from "./types"

// Mock authentication service
export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "demo@ck.com" && password === "demo123") {
          const user: User = {
            id: "user-1",
            name: "Demo User",
            email: "demo@ck.com",
            avatar: "/diverse-user-avatars.png",
            joinedDate: new Date("2023-01-15"),
            addresses: [
              {
                id: "addr-1",
                type: "home",
                name: "Home Address",
                street: "123 Main Street",
                city: "New York",
                state: "NY",
                zipCode: "10001",
                country: "USA",
                isDefault: true,
              },
              {
                id: "addr-2",
                type: "work",
                name: "Office Address",
                street: "456 Business Ave",
                city: "New York",
                state: "NY",
                zipCode: "10002",
                country: "USA",
                isDefault: false,
              },
            ],
          }
          this.currentUser = user
          localStorage.setItem("ck_user", JSON.stringify(user))
          resolve(user)
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 1000)
    })
  }

  register(name: string, email: string, password: string): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          joinedDate: new Date(),
          addresses: [],
        }
        this.currentUser = user
        localStorage.setItem("ck_user", JSON.stringify(user))
        resolve(user)
      }, 1000)
    })
  }

  logout(): void {
    this.currentUser = null
    localStorage.removeItem("ck_user")
    localStorage.removeItem("ck_cart")
    localStorage.removeItem("ck_wishlist")
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser

    const stored = localStorage.getItem("ck_user")
    if (stored) {
      this.currentUser = JSON.parse(stored)
      return this.currentUser
    }

    return null
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}
