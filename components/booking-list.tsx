"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User, Eye } from "lucide-react"

interface Booking {
  id: string
  propertyId: string
  propertyName: string
  location: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: "upcoming" | "active" | "completed" | "cancelled"
}

export function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // In a real app, this would fetch from Firestore
        // For now, we'll use mock data

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockBookings: Booking[] = [
          {
            id: "1",
            propertyId: "1",
            propertyName: "Luxury Beach Villa",
            location: "Malibu, California",
            checkIn: "2023-09-15",
            checkOut: "2023-09-22",
            guests: 4,
            totalPrice: 2450,
            status: "upcoming",
          },
          {
            id: "2",
            propertyId: "2",
            propertyName: "Mountain Retreat Cabin",
            location: "Aspen, Colorado",
            checkIn: "2023-08-10",
            checkOut: "2023-08-15",
            guests: 2,
            totalPrice: 1375,
            status: "completed",
          },
          {
            id: "3",
            propertyId: "3",
            propertyName: "Modern Downtown Loft",
            location: "New York City, New York",
            checkIn: "2023-10-05",
            checkOut: "2023-10-10",
            guests: 2,
            totalPrice: 1125,
            status: "upcoming",
          },
        ]

        setBookings(mockBookings)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load bookings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [toast])

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
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

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="mb-2 text-xl font-semibold">No bookings yet</h3>
        <p className="mb-6 text-muted-foreground">Your booking history will appear here</p>
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
                    <h3 className="text-lg font-semibold">{booking.propertyName}</h3>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {booking.location}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(booking.checkIn), "MMM d, yyyy")} -{" "}
                        {format(new Date(booking.checkOut), "MMM d, yyyy")}
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
                    <Link href={`/booking/${booking.id}`}>
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

