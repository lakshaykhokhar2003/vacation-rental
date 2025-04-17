"use client"
import Link from "next/link"
import {format} from "date-fns"
import {motion} from "framer-motion"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Skeleton} from "@/components/ui/skeleton"
import {Badge} from "@/components/ui/badge"
import {Calendar, Eye, MapPin, User} from "lucide-react"
import {useUserBookings} from "@/hooks/use-bookings"
import {useAuth} from "@/contexts/auth-context"
import {Booking, BookingListProps} from "@/types";


export function BookingList({ bookings: propBookings, isLoading: propIsLoading, emptyMessage }: BookingListProps) {
  const { user } = useAuth()

  const { data: fetchedBookings, isLoading: isFetchingBookings } = useUserBookings(user?.uid, {
    enabled: !propBookings && !!user?.uid,
  })

  const bookings = propBookings || fetchedBookings
  const isLoading = propIsLoading || isFetchingBookings

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>
    )
  }

  if (!bookings || bookings.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="mb-2 text-xl font-semibold">No bookings yet</h3>
          <p className="mb-6 text-muted-foreground">{emptyMessage || "Your booking history will appear here"}</p>
        </div>
    )
  }

  return (
      <div className="space-y-4">
        {bookings.map((booking, index) => (
            <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="text-lg font-semibold">Booking #{booking.id.slice(0, 6)}</h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        Property ID: {booking.propertyId}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                        {format(booking.checkIn.toDate(), "MMM d, yyyy")} -{" "}
                            {format(booking.checkOut.toDate(), "MMM d, yyyy")}
                      </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.guests} guests</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-lg font-bold">${booking.totalPrice}</p>
                        <p className="text-xs text-muted-foreground">Total price</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/booking/confirmation?id=${booking.id}`}>
                          <Eye className="mr-1 h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
        ))}
      </div>
  )
}

