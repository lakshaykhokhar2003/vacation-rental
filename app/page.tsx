import Image from "next/image"
import { SearchForm } from "@/components/search-form"
import { PropertyCard } from "@/components/property/property-card"
import { FeaturedDestinations } from "@/components/featured-destinations"
import { SpecialOffers } from "@/components/special-offers"
import { Testimonials } from "@/components/testimonials"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full">
        <Image
          src="/placeholder.svg?height=1200&width=2000"
          alt="Beautiful vacation destination"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20" />
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">Find Your Perfect Getaway</h1>
          <p className="mb-8 max-w-2xl text-lg md:text-xl">Discover and book unique accommodations around the world</p>
          <div className="w-full max-w-4xl rounded-lg bg-white p-4 shadow-lg">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container mx-auto py-16 px-4">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Featured Properties</h2>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-3xl font-bold">Popular Destinations</h2>
          <FeaturedDestinations destinations={popularDestinations} />
        </div>
      </section>

      {/* Special Offers */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="mb-10 text-3xl font-bold">Special Offers</h2>
        <SpecialOffers offers={specialOffers} />
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold">What Our Guests Say</h2>
          <Testimonials testimonials={testimonials} />
        </div>
      </section>

      {/* App Download */}
      <section className="container mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-between gap-8 rounded-2xl bg-primary p-8 text-white md:flex-row">
          <div className="max-w-xl">
            <h2 className="mb-4 text-3xl font-bold">Download Our App</h2>
            <p className="mb-6 text-lg">
              Book and manage your stays on the go. Get real-time notifications and exclusive mobile deals.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" size="lg">
                App Store
              </Button>
              <Button variant="secondary" size="lg">
                Google Play
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] w-[200px]">
            <Image
              src="/placeholder.svg?height=600&width=400"
              alt="Mobile app screenshot"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

// Sample data
const featuredProperties = [
  {
    id: 1,
    title: "Luxury Beach Villa",
    location: "Malibu, California",
    price: 350,
    rating: 4.9,
    reviews: 128,
    image: "/placeholder.svg?height=500&width=800",
    beds: 4,
    baths: 3,
    guests: 8,
    amenities: ["Pool", "Ocean View", "WiFi", "Kitchen"],
    isSuperhost: true,
  },
  {
    id: 2,
    title: "Mountain Retreat Cabin",
    location: "Aspen, Colorado",
    price: 275,
    rating: 4.8,
    reviews: 96,
    image: "/placeholder.svg?height=500&width=800",
    beds: 3,
    baths: 2,
    guests: 6,
    amenities: ["Fireplace", "Hot Tub", "WiFi", "Mountain View"],
    isSuperhost: false,
  },
  {
    id: 3,
    title: "Modern Downtown Loft",
    location: "New York City, New York",
    price: 225,
    rating: 4.7,
    reviews: 84,
    image: "/placeholder.svg?height=500&width=800",
    beds: 2,
    baths: 2,
    guests: 4,
    amenities: ["City View", "WiFi", "Gym", "Doorman"],
    isSuperhost: true,
  },
  {
    id: 4,
    title: "Lakefront Cottage",
    location: "Lake Tahoe, Nevada",
    price: 195,
    rating: 4.6,
    reviews: 72,
    image: "/placeholder.svg?height=500&width=800",
    beds: 2,
    baths: 1,
    guests: 4,
    amenities: ["Lake View", "Dock", "WiFi", "Kayaks"],
    isSuperhost: false,
  },
  {
    id: 5,
    title: "Tropical Paradise Villa",
    location: "Kauai, Hawaii",
    price: 420,
    rating: 4.9,
    reviews: 156,
    image: "/placeholder.svg?height=500&width=800",
    beds: 5,
    baths: 4,
    guests: 10,
    amenities: ["Pool", "Ocean View", "Garden", "BBQ"],
    isSuperhost: true,
  },
  {
    id: 6,
    title: "Historic Downtown Apartment",
    location: "Charleston, South Carolina",
    price: 185,
    rating: 4.7,
    reviews: 64,
    image: "/placeholder.svg?height=500&width=800",
    beds: 1,
    baths: 1,
    guests: 2,
    amenities: ["Historic District", "WiFi", "Balcony"],
    isSuperhost: false,
  },
  {
    id: 7,
    title: "Desert Oasis with Pool",
    location: "Scottsdale, Arizona",
    price: 310,
    rating: 4.8,
    reviews: 92,
    image: "/placeholder.svg?height=500&width=800",
    beds: 3,
    baths: 2,
    guests: 6,
    amenities: ["Pool", "Hot Tub", "Mountain View", "WiFi"],
    isSuperhost: true,
  },
  {
    id: 8,
    title: "Cozy Ski-in/Ski-out Chalet",
    location: "Park City, Utah",
    price: 340,
    rating: 4.9,
    reviews: 108,
    image: "/placeholder.svg?height=500&width=800",
    beds: 4,
    baths: 3,
    guests: 8,
    amenities: ["Ski-in/Ski-out", "Fireplace", "Hot Tub", "Mountain View"],
    isSuperhost: false,
  },
]

const popularDestinations = [
  {
    id: 1,
    name: "New York",
    image: "/placeholder.svg?height=400&width=600",
    properties: 1243,
  },
  {
    id: 2,
    name: "Miami",
    image: "/placeholder.svg?height=400&width=600",
    properties: 932,
  },
  {
    id: 3,
    name: "Los Angeles",
    image: "/placeholder.svg?height=400&width=600",
    properties: 1587,
  },
  {
    id: 4,
    name: "Chicago",
    image: "/placeholder.svg?height=400&width=600",
    properties: 745,
  },
  {
    id: 5,
    name: "San Francisco",
    image: "/placeholder.svg?height=400&width=600",
    properties: 865,
  },
  {
    id: 6,
    name: "Las Vegas",
    image: "/placeholder.svg?height=400&width=600",
    properties: 1123,
  },
]

const specialOffers = [
  {
    id: 1,
    title: "Last Minute Deals",
    description: "Save up to 25% on stays in the next 14 days",
    image: "/placeholder.svg?height=400&width=600",
    discount: "25%",
  },
  {
    id: 2,
    title: "Weekly Stays",
    description: "Stay longer and save more with weekly rates",
    image: "/placeholder.svg?height=400&width=600",
    discount: "15%",
  },
  {
    id: 3,
    title: "Early Bird Special",
    description: "Book 60 days in advance for special rates",
    image: "/placeholder.svg?height=400&width=600",
    discount: "20%",
  },
]

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    comment:
      "We had an amazing stay at the beach villa. The views were spectacular and the amenities were top-notch. Will definitely book again!",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Toronto, Canada",
    comment:
      "The mountain cabin exceeded our expectations. Perfect location for skiing and the hot tub was a great way to relax after a day on the slopes.",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    location: "London, UK",
    comment:
      "The downtown loft was stylish and in the perfect location. We could walk to all the best restaurants and attractions.",
    rating: 4,
    image: "/placeholder.svg?height=100&width=100",
  },
]

