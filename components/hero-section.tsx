"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Truck, Shield, Headphones } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Discover Premium Products at <span className="text-accent">CK</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-lg">
                Your trusted destination for quality electronics, fashion, home essentials, and more. Experience
                shopping redefined.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="group">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Explore Categories
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">4.8/5 from 10k+ reviews</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img src="/premium-smartphone.jpg" alt="Premium Products" className="rounded-lg shadow-lg" />
              <img
                src="/placeholder.svg?height=200&width=200"
                alt="Luxury Items"
                className="rounded-lg shadow-lg mt-8"
              />
              <img src="/modern-laptop.png" alt="Tech Products" className="rounded-lg shadow-lg -mt-4" />
              <img src="/designer-headphones.jpg" alt="Audio Equipment" className="rounded-lg shadow-lg mt-4" />
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t">
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 text-accent" />
            <div>
              <p className="font-semibold">Free Shipping</p>
              <p className="text-sm text-muted-foreground">On orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-accent" />
            <div>
              <p className="font-semibold">Secure Payment</p>
              <p className="text-sm text-muted-foreground">100% protected</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Headphones className="h-8 w-8 text-accent" />
            <div>
              <p className="font-semibold">24/7 Support</p>
              <p className="text-sm text-muted-foreground">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Star className="h-8 w-8 text-accent" />
            <div>
              <p className="font-semibold">Top Quality</p>
              <p className="text-sm text-muted-foreground">Premium products only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
