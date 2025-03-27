"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, MapPin } from "lucide-react"

export default function BookingConfirmation() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("id")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
            >
              <CheckCircle className="h-10 w-10 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
            <CardDescription>Your reservation has been successfully processed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">Booking Details</span>
              </div>
              <p className="text-sm text-muted-foreground">Confirmation #: {bookingId || "BKNG12345"}</p>
              <p className="text-sm text-muted-foreground">Check-in: September 15, 2023</p>
              <p className="text-sm text-muted-foreground">Check-out: September 22, 2023</p>
              <p className="text-sm text-muted-foreground">Guests: 2 adults</p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">Property Information</span>
              </div>
              <p className="text-sm text-muted-foreground">Luxury Beach Villa</p>
              <p className="text-sm text-muted-foreground">Malibu, California</p>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              A confirmation email has been sent to your email address.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/bookings">View My Bookings</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

