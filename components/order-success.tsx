"use client"

import { CheckCircle, Package, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface OrderSuccessProps {
  isVisible: boolean
  onContinueShopping: () => void
  onTrackOrder: () => void
}

export function OrderSuccess({ isVisible, onContinueShopping, onTrackOrder }: OrderSuccessProps) {
  if (!isVisible) return null

  const orderNumber = `CK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bounce-in-animation">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Thank You for Shopping!</h2>
            <p className="text-lg text-foreground mb-2">Your order is booked and will be delivered soon!</p>
            <p className="text-sm text-muted-foreground">Order #{orderNumber}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Package className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-medium text-sm">Order Confirmed</p>
                <p className="text-xs text-muted-foreground">Your order has been processed</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Clock className="h-5 w-5 text-accent" />
              <div className="text-left">
                <p className="font-medium text-sm">Estimated Delivery</p>
                <p className="text-xs text-muted-foreground">{estimatedDelivery}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <MapPin className="h-5 w-5 text-secondary" />
              <div className="text-left">
                <p className="font-medium text-sm">Tracking Available</p>
                <p className="text-xs text-muted-foreground">You'll receive tracking info via email</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={onContinueShopping} className="w-full" size="lg">
              Continue Shopping
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={onTrackOrder}>
              Track Your Order
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
