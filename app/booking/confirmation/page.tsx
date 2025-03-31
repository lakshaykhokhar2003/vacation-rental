  "use client"

  import { useSearchParams } from "next/navigation"
  import Link from "next/link"
  import { motion } from "framer-motion"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
  import { CheckCircle, Calendar, MapPin, User, Loader2 } from "lucide-react"
  import { useBooking } from "@/hooks/use-bookings"
  import { useProperty } from "@/hooks/use-properties"
  import { format } from "date-fns"

  export default function BookingConfirmation() {
    const searchParams = useSearchParams()
    const bookingId = searchParams.get("id")

    const { data: booking, isLoading: isLoadingBooking, error: bookingError } = useBooking(bookingId || "")

    const { data: property, isLoading: isLoadingProperty } = useProperty(booking?.propertyId || "", {
      enabled: !!booking?.propertyId,
    })

    const isLoading = isLoadingBooking || isLoadingProperty
    const error = bookingError


    if (isLoading) {
      return (
          <div className="container flex items-center justify-center py-16 px-4">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-lg">Loading your booking confirmation...</p>
            </div>
          </div>
      )
    }

    if (error || !bookingId) {
      return (
          <div className="container flex items-center justify-center py-16 px-4">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Booking Not Found</CardTitle>
                <CardDescription>We couldn't find the booking information you're looking for.</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Button asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
      )
    }

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
                  <p className="text-sm text-muted-foreground">Confirmation #: {bookingId}</p>
                  {booking && (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Check-in: {format(booking.checkIn.toDate(), "MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Check-out: {format(booking.checkOut.toDate(), "MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Guests: {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                        </p>
                      </>
                  )}
                </div>

                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <div className="mb-2 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-medium">Guest Information</span>
                  </div>
                  {booking?.guestInfo && (
                      <>
                        <p className="text-sm text-muted-foreground">Primary Guest: {booking.guestInfo.name}</p>
                        <p className="text-sm text-muted-foreground">Email: {booking.guestInfo.email}</p>
                        {booking.guestInfo.phone && (
                            <p className="text-sm text-muted-foreground">Phone: {booking.guestInfo.phone}</p>
                        )}
                      </>
                  )}
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="font-medium">Property Information</span>
                  </div>
                  {property && (
                      <>
                        <p className="text-sm text-muted-foreground">{property.title}</p>
                        <p className="text-sm text-muted-foreground">{property.location}</p>
                      </>
                  )}
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
                  <Link href="/dashboard">View My Bookings</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
    )
  }

