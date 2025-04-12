"use client"
import Image from "next/image"
import {useRouter} from "next/navigation"
import {motion} from "framer-motion"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {BookingForm} from "@/components/booking-form"
import {PropertyGallery} from "@/components/property/property-gallery"
import {PropertyAmenities} from "@/components/property/property-amenities"
import {PropertyReviews} from "@/components/property/property-reviews"
import {PropertyMap} from "@/components/property/property-map"
import {Bath, Bed, Home, MapPin, Star, Users} from "lucide-react"
import {Skeleton} from "@/components/ui/skeleton"
import {useProperty} from "@/hooks/use-properties"
import {use} from "react";
import {useUser} from "@/hooks/use-user";
import {useAuth} from "@/contexts/auth-context";
import Link from "next/link";

export default function PropertyDetails({ params }: { params: Promise<{ id: string }>}) {
  const {id} = use(params)
  const {user} = useAuth()
  const router = useRouter()
  const { data: property, isLoading, error } = useProperty(id)
  const { data: owner, isLoading: ownerLoading, error: ownerError } = useUser(property?.ownerId || "")
  const isOwner = user && property?.ownerId === user.uid
  if (isLoading || ownerLoading) {
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

  if (error || !property || ownerError || !owner) {
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
            <span className="font-medium">{property.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({property.reviews} reviews)</span>
            <span className="mx-2">•</span>
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{property.location}</span>
          </div>

          {property.isSuperhost && (
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
                <PropertyReviews propertyId={property.id || ""} />
              </TabsContent>
              <TabsContent value="location" className="mt-4">
                <PropertyMap location={property.location} coordinates={property.coordinates} />
              </TabsContent>
            </Tabs>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Hosted by {owner?.displayName || "Owner"}</h2>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <Image src={owner?.photoURL || "/placeholder.svg?height=100&width=100"} alt="Host" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    Host since{" "}
                    {property.createdAt
                        ? new Date(property.createdAt.seconds * 1000).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                        : "N/A"}
                  </p>
                  {property.isSuperhost && <p className="text-primary font-medium">Superhost</p>}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {isOwner ? (
                    <div className="text-center py-6">
                      <h3 className="text-lg font-semibold mb-2">This is your property</h3>
                      <p className="text-muted-foreground mb-4">You cannot book your own property.</p>
                      <Button asChild className="w-full">
                        <Link href={`/dashboard/properties/${property.id}`}>Edit Property</Link>
                      </Button>
                    </div>
                ) : (
                    <BookingForm property={property} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
  )
}

