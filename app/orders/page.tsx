"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, Eye, Download, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { mockOrders } from "@/lib/mock-data"
import type { Order } from "@/lib/types"

export default function OrderHistoryPage() {
  const router = useRouter()
  const [orders] = useState<Order[]>(mockOrders)

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return <Clock className="w-4 h-4" />
      case "shipped":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return "bg-yellow-500"
      case "shipped":
        return "bg-blue-500"
      case "delivered":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const filterOrdersByStatus = (status?: Order["status"]) => {
    if (!status) return orders
    return orders.filter((order) => order.status === status)
  }

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
            <p className="text-sm text-muted-foreground">Placed on {order.createdAt.toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(order.status)} text-white`}>
              {getStatusIcon(order.status)}
              <span className="ml-1 capitalize">{order.status}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Order Items */}
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium line-clamp-1">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity} × ${item.product.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>
              {order.status === "shipped" && (
                <p className="text-sm text-muted-foreground">
                  Expected delivery: {order.estimatedDelivery.toLocaleDateString()}
                </p>
              )}
              {order.status === "delivered" && (
                <p className="text-sm text-green-600">Delivered on {order.estimatedDelivery.toLocaleDateString()}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">${order.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Invoice
            </Button>
            {order.status === "shipped" && (
              <Button variant="outline" size="sm">
                <Truck className="w-4 h-4 mr-2" />
                Track Order
              </Button>
            )}
            {order.status === "delivered" && (
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Return/Exchange
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6" />
            <h1 className="text-3xl font-bold">Order History</h1>
            <Badge variant="secondary">{orders.length} orders</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
              <TabsTrigger value="processing">Processing ({filterOrdersByStatus("processing").length})</TabsTrigger>
              <TabsTrigger value="shipped">Shipped ({filterOrdersByStatus("shipped").length})</TabsTrigger>
              <TabsTrigger value="delivered">Delivered ({filterOrdersByStatus("delivered").length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                  <Package className="h-24 w-24 text-muted-foreground mb-6" />
                  <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    When you place your first order, it will appear here.
                  </p>
                  <Button onClick={() => router.push("/")}>Start Shopping</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="processing" className="mt-6">
              <div className="space-y-4">
                {filterOrdersByStatus("processing").map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {filterOrdersByStatus("processing").length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No processing orders</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="shipped" className="mt-6">
              <div className="space-y-4">
                {filterOrdersByStatus("shipped").map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {filterOrdersByStatus("shipped").length === 0 && (
                  <div className="text-center py-12">
                    <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No shipped orders</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="delivered" className="mt-6">
              <div className="space-y-4">
                {filterOrdersByStatus("delivered").map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {filterOrdersByStatus("delivered").length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No delivered orders</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
