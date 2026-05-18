"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, Truck, CheckCircle, Clock, Search, AlertCircle, X } from "lucide-react"

interface OrderTrackingProps {
  isVisible: boolean
  onClose: () => void
}

export function OrderTracking({ isVisible, onClose }: OrderTrackingProps) {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [orderFound, setOrderFound] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const validTrackingNumbers = ["CK123456789", "CK987654321", "CK555666777"]

  const handleTrackOrder = async () => {
    if (!trackingNumber.trim()) return

    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const isValid = validTrackingNumbers.includes(trackingNumber.trim())
    setOrderFound(isValid)
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTrackOrder()
    }
  }

  const resetTracking = () => {
    setTrackingNumber("")
    setOrderFound(null)
    setIsLoading(false)
  }

  if (!isVisible) return null

  const mockOrder = {
    orderNumber: trackingNumber || "CK123456789",
    status: "shipped" as const,
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    items: [
      { name: "Premium Wireless Headphones", quantity: 1, price: 299.99 },
      { name: "Smart Fitness Tracker", quantity: 1, price: 149.99 },
    ],
    totalAmount: 449.98,
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Track Your Order</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {orderFound === null ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="tracking" className="text-sm font-medium">
                  Enter your order number
                </label>
                <div className="flex gap-2">
                  <Input
                    id="tracking"
                    placeholder="e.g., CK123456789"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                  />
                  <Button onClick={handleTrackOrder} disabled={isLoading || !trackingNumber.trim()}>
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    {isLoading ? "Tracking..." : "Track"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  You can find your order number in the confirmation email we sent you.
                </p>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs font-medium mb-1">Demo tracking numbers:</p>
                  <div className="flex flex-wrap gap-2">
                    {validTrackingNumbers.map((num) => (
                      <Badge
                        key={num}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => setTrackingNumber(num)}
                      >
                        {num}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : orderFound === false ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Order not found. Please check your tracking number and try again.</AlertDescription>
              </Alert>

              <div className="space-y-2">
                <p className="text-sm font-medium">Tracking number entered:</p>
                <Badge variant="outline" className="font-mono">
                  {trackingNumber}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Make sure you've entered the correct order number. It should look like "CK123456789".
                </p>
                <p className="text-sm text-muted-foreground">
                  If you continue to have issues, please contact our customer support.
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={resetTracking}>
                  Try Again
                </Button>
                <Button variant="outline">Contact Support</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Order #{mockOrder.orderNumber}</h3>
                  <p className="text-sm text-muted-foreground">Estimated delivery: {mockOrder.estimatedDelivery}</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {mockOrder.status.charAt(0).toUpperCase() + mockOrder.status.slice(1)}
                </Badge>
              </div>

              <Separator />

              {/* Tracking Progress */}
              <div className="space-y-4">
                <h4 className="font-medium">Tracking Progress</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Order Confirmed</p>
                      <p className="text-xs text-muted-foreground">Your order has been received and confirmed</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Package Prepared</p>
                      <p className="text-xs text-muted-foreground">
                        Your items have been packed and ready for shipping
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Truck className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">In Transit</p>
                      <p className="text-xs text-muted-foreground">Your package is on its way to you</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Today</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-muted-foreground">Delivered</p>
                      <p className="text-xs text-muted-foreground">Package will be delivered to your address</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Expected in 2 days</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div className="space-y-4">
                <h4 className="font-medium">Order Items</h4>
                <div className="space-y-3">
                  {mockOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-medium">${item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold text-lg">${mockOrder.totalAmount}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={resetTracking}>
                  Track Another Order
                </Button>
                <Button className="flex-1" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
