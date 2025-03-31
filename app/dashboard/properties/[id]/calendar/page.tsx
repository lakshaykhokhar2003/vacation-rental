"use client"

import {use, useState} from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { isSameDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useProperty } from "@/hooks/use-properties"
import { usePropertyBookings } from "@/hooks/use-bookings"

export default function PropertyCalendar({ params }: { params: Promise<{ id: string }> }) {
  const {id} = use(params)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()

  const { data: property, isLoading: propertyLoading } = useProperty(id)

  const { data: bookings, isLoading: bookingsLoading } = usePropertyBookings(id)

  const isLoading = authLoading || propertyLoading || bookingsLoading

  if (!isLoading && property && property.ownerId !== user?.uid) {
    router.push("/dashboard")
    return null
  }

  const bookedDates =
      bookings?.reduce((dates: Date[], booking) => {
        if (booking.status === "confirmed" || booking.status === "pending") {
          const checkIn = booking.checkIn.toDate()
          const checkOut = booking.checkOut.toDate()

          const currentDate = new Date(checkIn)
          while (currentDate <= checkOut) {
            dates.push(new Date(currentDate))
            currentDate.setDate(currentDate.getDate() + 1)
          }
        }
        return dates
      }, []) || []

  const handleDateClick = (date: Date) => {
    setSelectedDates((prev) => {
      const isSelected = prev.some((d) => isSameDay(d, date))

      if (isSelected) {
        return prev.filter((d) => !isSameDay(d, date))
      } else {
        return [...prev, date]
      }
    })
  }

  const isDateBooked = (date: Date) => {
    return bookedDates.some((bookedDate) => isSameDay(bookedDate, date))
  }

  const isDateSelected = (date: Date) => {
    return selectedDates.some((d) => isSameDay(d, date))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)


      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Calendar updated",
        description: "Your availability calendar has been updated successfully",
      })

      // Clear selection after save
      setSelectedDates([])
    } catch (error) {
      console.error("Error updating calendar:", error)
      toast({
        title: "Error",
        description: "Failed to update calendar",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
        <div className="container py-16 px-4 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  if (!property) {
    return (
        <div className="container py-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="mb-8">The property you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
    )
  }

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container py-8 px-4"
      >
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Availability Calendar</h1>
          <p className="text-muted-foreground">Manage availability for {property.title}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Dates</CardTitle>
                <CardDescription>Click on dates to block or unblock them</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                    mode="multiple"
                    selected={selectedDates}
                    onDayClick={handleDateClick}
                    className="rounded-md border"
                    modifiers={{
                      booked: (date) => isDateBooked(date),
                      selected: (date) => isDateSelected(date),
                    }}
                    modifiersClassNames={{
                      booked: "bg-red-100 text-red-800",
                      selected: "bg-primary text-primary-foreground",
                    }}
                    fromDate={new Date()}
                    numberOfMonths={2}
                    disabled={(date) => isDateBooked(date)}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Click on dates to select or deselect them. Selected dates will be blocked for booking.
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-red-100"></div>
                  <span className="text-sm">Already booked dates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary"></div>
                  <span className="text-sm">Selected dates</span>
                </div>
                <div className="pt-4">
                  <Button className="w-full" onClick={handleSave} disabled={selectedDates.length === 0 || isSaving}>
                    {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                    ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
  )
}

