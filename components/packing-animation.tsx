"use client"

import { useEffect, useState } from "react"
import { Package, Truck, CheckCircle } from "lucide-react"

interface PackingAnimationProps {
  isVisible: boolean
  onComplete: () => void
}

export function PackingAnimation({ isVisible, onComplete }: PackingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const steps = [
      { duration: 1500, step: 1 }, // Packing step
      { duration: 2000, step: 2 }, // Loading into van step
      { duration: 1500, step: 3 }, // Delivery van driving away
    ]

    let timeoutId: NodeJS.Timeout

    const runAnimation = (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        onComplete()
        return
      }

      setCurrentStep(stepIndex + 1)
      timeoutId = setTimeout(() => {
        runAnimation(stepIndex + 1)
      }, steps[stepIndex].duration)
    }

    runAnimation(0)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-primary mb-2">Processing Your Order</h3>
          <p className="text-muted-foreground">Please wait while we prepare your package</p>
        </div>

        <div className="relative h-32 mb-6 flex items-center justify-center overflow-hidden">
          {/* Step 1: Product Packing */}
          {currentStep === 1 && (
            <div className="flex items-center justify-center">
              <div className="relative">
                <Package className="h-16 w-16 text-primary pack-animation" />
                <div className="absolute inset-0 border-2 border-dashed border-primary rounded-lg animate-pulse" />
              </div>
            </div>
          )}

          {/* Step 2: Loading into Van */}
          {currentStep === 2 && (
            <div className="flex items-center justify-center gap-4">
              <Package className="h-12 w-12 text-primary animate-bounce" />
              <div className="text-2xl animate-pulse">→</div>
              <Truck className="h-16 w-16 text-accent animate-pulse" />
            </div>
          )}

          {/* Step 3: Delivery Van Animation */}
          {currentStep === 3 && (
            <div className="relative w-full h-16 flex items-center">
              <Truck className="h-16 w-16 text-accent delivery-animation" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                <div className="h-full bg-accent animate-pulse" style={{ width: "100%" }} />
              </div>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center gap-4 mb-4">
          <div className={`flex flex-col items-center ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 ${
                currentStep >= 1 ? "border-primary bg-primary text-white" : "border-muted-foreground"
              }`}
            >
              {currentStep > 1 ? <CheckCircle className="h-4 w-4" /> : "1"}
            </div>
            <span className="text-xs">Packing</span>
          </div>

          <div className={`flex flex-col items-center ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 ${
                currentStep >= 2 ? "border-primary bg-primary text-white" : "border-muted-foreground"
              }`}
            >
              {currentStep > 2 ? <CheckCircle className="h-4 w-4" /> : "2"}
            </div>
            <span className="text-xs">Loading</span>
          </div>

          <div className={`flex flex-col items-center ${currentStep >= 3 ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 ${
                currentStep >= 3 ? "border-primary bg-primary text-white" : "border-muted-foreground"
              }`}
            >
              {currentStep > 3 ? <CheckCircle className="h-4 w-4" /> : "3"}
            </div>
            <span className="text-xs">Shipping</span>
          </div>
        </div>

        {/* Status Text */}
        <div className="text-sm text-muted-foreground">
          {currentStep === 1 && "Carefully packing your items..."}
          {currentStep === 2 && "Loading package into delivery van..."}
          {currentStep === 3 && "Your package is on its way!"}
        </div>
      </div>
    </div>
  )
}
