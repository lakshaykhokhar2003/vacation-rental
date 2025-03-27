"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { addDays, isSameDay, isWithinInterval } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

interface Property {
  id: string
  title: string
}

interface BlockedDate {
  from: Date
  to: Date
}

export default function PropertyCalendar({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null)
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // In a real app, this would fetch from Firestore
        // For now, we'll use mock data

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockProperty: Property = {
          id: params.id,
          title: "Luxury Beach Villa",
        }

        const mockBlockedDates: BlockedDate[] = [
          {
            from: addDays(new Date(), 5),
            to: addDays(new Date(), 10),
          },
          {
            from: addDays(new Date(), 15),
            to: addDays(new Date(), 20),
          },
        ]

        setProperty(mockProperty)
        setBlockedDates(mockBlockedDates)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load property data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [params.id, toast])

  const handleDateClick = (date: Date) => {
    setSelectedDates((prev) => {
      // Check if date is already selected
      const isSelected = prev.some((d) => isSameDay(d, date))

      if (isSelected) {
        // Remove date if already selected
        return prev.filter((d) => !isSameDay(d, date))
      } else {
        // Add date if not selected
        return [...prev, date]
      }
    })
  }

  const isDateBlocked = (date: Date) => {
    return blockedDates.some((blocked) => isWithinInterval(date, { start: blocked.from, end: blocked.to }))
  }

  const isDateSelected = (date: Date) => {
    return selectedDates.some((d) => isSameDay(d, date))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      // In a real app, this would save to Firestore
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Calendar updated",
        description: "Your availability calendar has been updated successfully",
      })

      // Clear selection after save
      setSelectedDates([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update calendar",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-16 px-4 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
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
                  blocked: (date) => isDateBlocked(date),
                  selected: (date) => isDateSelected(date),
                }}
                modifiersClassNames={{
                  blocked: "bg-red-100 text-red-800",
                  selected: "bg-primary text-primary-foreground",
                }}
                fromDate={new Date()}
                numberOfMonths={2}
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
                <span className="text-sm">Already blocked dates</span>
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

