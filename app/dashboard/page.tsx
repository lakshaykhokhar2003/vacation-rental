"use client"

import Link from "next/link"
import {motion} from "framer-motion"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Button} from "@/components/ui/button"
import {PropertyList} from "@/components/property/property-list"
import {BookingList} from "@/components/booking-list"
import {useAuth} from "@/contexts/auth-context"
import {useUserProperties} from "@/hooks/use-properties"
import {useUserBookings} from "@/hooks/use-bookings"
import {Calendar, Database, Home, Loader2, Plus, Trash2} from "lucide-react"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const { data: properties, isLoading: isLoadingProperties } = useUserProperties(user?.uid, {
    enabled: !!user?.uid,
  })

  const { data: bookings, isLoading: isLoadingBookings } = useUserBookings(user?.uid, {
    enabled: !!user?.uid,
  })

  if (loading) {
    return (
        <div className="container mx-auto py-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-lg">Loading...</p>
          </div>
        </div>
    )
  }


  const totalRevenue = bookings
      ? bookings
          .filter((booking) => booking.status === "confirmed" || booking.status === "completed")
          .reduce((sum, booking) => sum + booking.totalPrice, 0)
      : 0

  const activeBookings = bookings ? bookings.filter((booking) => booking.status === "confirmed").length : 0

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto py-8 px-4"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your properties and bookings</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Button asChild>
              <Link href="/dashboard/properties/new">
                <Plus className="mr-2 h-4 w-4" /> Add Property
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/generate-mock-data">
                <Database className="mr-2 h-4 w-4" /> Generate Mock Data
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/delete-mock-data">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Mock Data
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingProperties ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                    properties?.length || 0
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingBookings ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : activeBookings}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingBookings ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                    `$${totalRevenue.toLocaleString()}`
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="properties">
          <TabsList className="mb-4">
            <TabsTrigger value="properties">
              <Home className="mr-2 h-4 w-4" /> Properties
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <Calendar className="mr-2 h-4 w-4" /> Bookings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>Your Properties</CardTitle>
                <CardDescription>Manage and view all your listed properties</CardDescription>
              </CardHeader>
              <CardContent>
                <PropertyList
                    properties={properties}
                    isLoading={isLoadingProperties}
                    emptyMessage="You haven't listed any properties yet."
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Your Bookings</CardTitle>
                <CardDescription>View and manage all your property bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <BookingList
                    bookings={bookings}
                    isLoading={isLoadingBookings}
                    emptyMessage="You don't have any bookings yet."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
  )
}

