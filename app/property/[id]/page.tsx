"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingForm } from "@/components/booking-form"
import { PropertyGallery } from "@/components/property/property-gallery"
import { PropertyAmenities } from "@/components/property/property-amenities"
import { PropertyReviews } from "@/components/property/property-reviews"
import { PropertyMap } from "@/components/property/property-map"
import { Bed, Bath, Users, Star, MapPin, Home } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Property {
  id: string
  title: string
  description: string
  location: string
  price: number
  rating: number
  reviews: number
  images: string[]
  beds: number
  baths: number
  guests: number
  amenities: string[]
  isSuperHost: boolean
  nights: number
  serviceFee: number
  subtotal: number
  total: number
  host: {
    name: string
    image: string
    joinedDate: string
  }
  coordinates: {
    lat: number
    lng: number
  }
}

export default function PropertyDetails({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
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
          description:
            "Experience the ultimate beachfront luxury in this stunning villa. Wake up to panoramic ocean views and fall asleep to the sound of waves. This spacious property features modern amenities, a private pool, and direct beach access. Perfect for families or groups looking for a memorable vacation.\n\nThe villa is designed with an open floor plan, allowing natural light to fill the space. The fully equipped gourmet kitchen has everything you need to prepare meals, and the dining area seats up to 8 guests. The living room opens to a large terrace with comfortable seating and breathtaking views.\n\nAll bedrooms have en-suite bathrooms and premium bedding. The master suite includes a king-size bed, walk-in closet, and a luxurious bathroom with a soaking tub and separate shower.",
          location: "Malibu, California",
          price: 350,
          rating: 4.9,
          reviews: 128,
          images: [
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
          ],
          beds: 4,
          baths: 3,
          guests: 8,
          amenities: [
            "Pool",
            "Ocean View",
            "WiFi",
            "Kitchen",
            "Free Parking",
            "Air Conditioning",
            "BBQ Grill",
            "Washer & Dryer",
            "TV",
            "Beach Access",
          ],
          nights: 7,
          serviceFee: 50,
          subtotal: 2450,
          total: 2500,
          isSuperHost: true,
          host: {
            name: "Michael Johnson",
            image: "/placeholder.svg?height=100&width=100",
            joinedDate: "January 2018",
          },
          coordinates: {
            lat: 34.0259,
            lng: -118.7798,
          },
        }

        setProperty(mockProperty)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load property details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [params.id, toast])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-[300px] rounded-lg" />
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <p className="mb-8">The property you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4"
    >
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>

      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{property.rating}</span>
          <span className="text-muted-foreground">({property.reviews} reviews)</span>
          <span className="mx-2">•</span>
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{property.location}</span>
        </div>

        {property.isSuperHost && (
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">Superhost</div>
        )}
      </div>

      <PropertyGallery images={property.images} />

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="flex flex-wrap items-center gap-6 mb-6 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{property.beds} beds</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{property.baths} baths</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Up to {property.guests} guests</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Entire home</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="description" className="mb-8">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <div className="space-y-4">
                <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="amenities" className="mt-4">
              <PropertyAmenities amenities={property.amenities} />
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <PropertyReviews propertyId={property.id} />
            </TabsContent>
            <TabsContent value="location" className="mt-4">
              <PropertyMap location={property.location} coordinates={property.coordinates} />
            </TabsContent>
          </Tabs>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Hosted by {property.host.name}</h2>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src={property.host.image || "/placeholder.svg"}
                  alt={property.host.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-muted-foreground">Host since {property.host.joinedDate}</p>
                {property.isSuperHost && <p className="text-primary font-medium">Superhost</p>}
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <BookingForm property={property}  nights={property.nights} serviceFee={property.serviceFee} subtotal={property.subtotal} total={property.total} />
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

