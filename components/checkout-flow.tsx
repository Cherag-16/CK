"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  CreditCard,
  Truck,
  MapPin,
  Plus,
  Edit,
  Check,
  ArrowLeft,
  ArrowRight,
  Wallet,
  Building2,
  Smartphone,
} from "lucide-react"
import type { CartItem, Address, User } from "@/lib/types"

interface CheckoutFlowProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  user: User
  onOrderComplete: () => void
}

type CheckoutStep = "address" | "payment" | "review"

interface PaymentMethod {
  id: string
  type: "card" | "upi" | "wallet" | "cod"
  name: string
  icon: React.ReactNode
  details?: string
}

export function CheckoutFlow({ isOpen, onClose, cartItems, user, onOrderComplete }: CheckoutFlowProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address")
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    user.addresses.find((addr) => addr.isDefault) || user.addresses[0] || null,
  )
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: "home",
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    isDefault: false,
  })

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      type: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="h-5 w-5" />,
      details: "Visa, Mastercard, American Express",
    },
    {
      id: "upi",
      type: "upi",
      name: "UPI Payment",
      icon: <Smartphone className="h-5 w-5" />,
      details: "Google Pay, PhonePe, Paytm",
    },
    {
      id: "wallet",
      type: "wallet",
      name: "Digital Wallet",
      icon: <Wallet className="h-5 w-5" />,
      details: "PayPal, Apple Pay, Google Pay",
    },
    {
      id: "cod",
      type: "cod",
      name: "Cash on Delivery",
      icon: <Building2 className="h-5 w-5" />,
      details: "Pay when you receive your order",
    },
  ]

  if (!isOpen) return null

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.street && newAddress.city && newAddress.state && newAddress.zipCode) {
      const address: Address = {
        id: `addr-${Date.now()}`,
        type: newAddress.type as "home" | "work" | "other",
        name: newAddress.name,
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        zipCode: newAddress.zipCode,
        country: newAddress.country || "USA",
        isDefault: newAddress.isDefault || false,
      }

      // In a real app, this would update the user's addresses
      setSelectedAddress(address)
      setShowAddAddress(false)
      setNewAddress({
        type: "home",
        name: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
        isDefault: false,
      })
    }
  }

  const handlePlaceOrder = () => {
    onOrderComplete()
    onClose()
  }

  const renderAddressStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Delivery Address</h3>
        <Button variant="outline" size="sm" onClick={() => setShowAddAddress(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      {!showAddAddress ? (
        <div className="space-y-3">
          <RadioGroup
            value={selectedAddress?.id}
            onValueChange={(value) => {
              const address = user.addresses.find((addr) => addr.id === value)
              if (address) setSelectedAddress(address)
            }}
          >
            {user.addresses.map((address) => (
              <div key={address.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor={address.id} className="font-medium">
                      {address.name}
                    </Label>
                    <Badge variant={address.type === "home" ? "default" : "secondary"}>{address.type}</Badge>
                    {address.isDefault && <Badge variant="outline">Default</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address.street}, {address.city}, {address.state} {address.zipCode}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </RadioGroup>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address-name">Full Name</Label>
                <Input
                  id="address-name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address-type">Address Type</Label>
                <RadioGroup
                  value={newAddress.type}
                  onValueChange={(value) => setNewAddress({ ...newAddress, type: value as "home" | "work" | "other" })}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home">Home</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="work" id="work" />
                    <Label htmlFor="work">Work</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div>
              <Label htmlFor="street">Street Address</Label>
              <Textarea
                id="street"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddAddress}>Save Address</Button>
              <Button variant="outline" onClick={() => setShowAddAddress(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Payment Method</h3>

      <RadioGroup
        value={selectedPayment?.id}
        onValueChange={(value) => {
          const method = paymentMethods.find((m) => m.id === value)
          if (method) setSelectedPayment(method)
        }}
      >
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-start space-x-3 p-4 border rounded-lg">
            <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                {method.icon}
                <Label htmlFor={method.id} className="font-medium">
                  {method.name}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">{method.details}</p>
            </div>
          </div>
        ))}
      </RadioGroup>

      {selectedPayment?.type === "card" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Card Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <Input id="card-number" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
            <div>
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input id="card-name" placeholder="John Doe" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderReviewStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Order Review</h3>

      {/* Delivery Address */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Delivery Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedAddress && (
            <div>
              <p className="font-medium">{selectedAddress.name}</p>
              <p className="text-sm text-muted-foreground">
                {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedPayment && (
            <div className="flex items-center gap-3">
              {selectedPayment.icon}
              <span className="font-medium">{selectedPayment.name}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Order Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-sm">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const canProceed = () => {
    switch (currentStep) {
      case "address":
        return selectedAddress !== null
      case "payment":
        return selectedPayment !== null
      case "review":
        return true
      default:
        return false
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Checkout</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            ×
          </Button>
        </CardHeader>

        <CardContent>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[
                  { key: "address", label: "Address", icon: MapPin },
                  { key: "payment", label: "Payment", icon: CreditCard },
                  { key: "review", label: "Review", icon: Check },
                ].map((step, index) => (
                  <div key={step.key} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        currentStep === step.key
                          ? "bg-primary text-primary-foreground"
                          : index < ["address", "payment", "review"].indexOf(currentStep)
                            ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <step.icon className="h-4 w-4" />
                    </div>
                    <span
                      className={`ml-2 text-sm ${currentStep === step.key ? "font-medium" : "text-muted-foreground"}`}
                    >
                      {step.label}
                    </span>
                    {index < 2 && <div className="w-8 h-px bg-border mx-4" />}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              {currentStep === "address" && renderAddressStep()}
              {currentStep === "payment" && renderPaymentStep()}
              {currentStep === "review" && renderReviewStep()}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentStep === "payment") setCurrentStep("address")
                    else if (currentStep === "review") setCurrentStep("payment")
                  }}
                  disabled={currentStep === "address"}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>

                <Button
                  onClick={() => {
                    if (currentStep === "address") setCurrentStep("payment")
                    else if (currentStep === "payment") setCurrentStep("review")
                    else handlePlaceOrder()
                  }}
                  disabled={!canProceed()}
                >
                  {currentStep === "review" ? "Place Order" : "Continue"}
                  {currentStep !== "review" && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-base">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {shipping === 0 && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">Free shipping applied!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
