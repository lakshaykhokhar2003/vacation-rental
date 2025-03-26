// components/booking-form.tsx
"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { PaymentForm } from "./payment-form"

// Add Stripe imports at the top of the file
import { Elements } from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripe"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
})

interface BookingFormProps {
  property: {
    id: string
    title: string
    location: string
    price: number
  }
  nights: number
  total: number
  subtotal: number
  serviceFee: number
}

export function BookingForm({ property, nights, total, subtotal, serviceFee }: BookingFormProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (step === 2) {
      return (
          <Elements stripe={stripePromise}>
            <PaymentForm
                property={property}
                nights={nights}
                subtotal={subtotal}
                serviceFee={serviceFee}
                total={total}
                formData={form.getValues()}
                onBack={() => setStep(1)}
                onSuccess={(id) => router.push(`/booking/confirmation?id=${id}`)}
            />
          </Elements>
      )
    }

    try {
      setIsLoading(true)

      // In a real app, this would submit to your backend
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Booking confirmed!",
        description: `Your stay at ${property.title} has been booked. A confirmation email has been sent to ${values.email}.`,
      })

      // Redirect to a confirmation page
      router.push(`/booking/confirmation?id=${property.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem processing your booking.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">
          ${property.price} <span className="text-sm text-muted-foreground">/ night</span>
        </h2>
        <Badge variant="secondary">{step === 1 ? "Contact Info" : "Payment"}</Badge>
      </div>
      <Separator className="my-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 ? (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="555-555-5555" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : null}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)} className={cn(step === 1 ? "hidden" : "")}>
              Back
            </Button>
            <Button type="submit" disabled={isLoading}>
              {step === 1 ? "Next" : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </Form>
      <Separator className="my-4" />
      <div className="space-y-2">
        <h3 className="text-lg font-bold">Your stay</h3>
        <div className="flex justify-between">
          <p className="text-muted-foreground">
            {property.title} ({nights} nights)
          </p>
          <p>${subtotal}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-muted-foreground">Service Fee</p>
          <p>${serviceFee}</p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between font-bold text-lg">
        Total
        <span>${total}</span>
      </div>
    </div>
  )

  // Wrap the form with Stripe Elements if on step 2
  // Add this right before the return statement:

}

