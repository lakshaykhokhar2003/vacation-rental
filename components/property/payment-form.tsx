"use client"

import type React from "react"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Property {
  id: string
  title: string
}

interface FormData {
  name: string
  email: string
  checkIn: Date
  checkOut: Date
  guests: number
}

interface PaymentFormProps {
  property: Property
  nights: number
  subtotal: number
  serviceFee: number
  total: number
  formData: FormData
  onBack: () => void
  onSuccess: (id: string) => void
}

export function PaymentForm({
  property,
  nights,
  subtotal,
  serviceFee,
  total,
  formData,
  onBack,
  onSuccess,
}: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would create a payment intent on your server
      // and return a client secret

      // Simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Payment successful!",
        description: `Your booking for ${property.title} has been confirmed.`,
      })

      onSuccess(property.id)
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was a problem processing your payment.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Payment Details</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <PaymentElement  />
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between mb-2">
              <span>
                ${property.price} x {nights} nights
              </span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Service fee</span>
              <span>${serviceFee}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !stripe || !elements}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${total}`
            )}
          </Button>

          <Button type="button" variant="outline" className="w-full mt-2" onClick={onBack} disabled={isLoading}>
            Back
          </Button>
        </form>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Your payment information is secure. We use Stripe for secure payment processing.
      </p>
    </div>
  )
}

