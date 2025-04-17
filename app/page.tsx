import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/property/property-card"
import { HeroCarousel } from "@/components/hero-carousel"
import { SkeletonProperty } from "@/components/property/skeleton-property-card"
import { Suspense } from "react"
import { getFeaturedProperties } from "@/lib/services/property-service"

async function FeaturedProperties() {
  const newProperties = await getFeaturedProperties()
  const properties = newProperties.map((property) => ({
    ...property,
    createdAt: property.createdAt.toDate().getTime(),
    updatedAt: property.updatedAt.toDate().getTime(),
  }))

  return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {properties?.map((property, index) => (
            <div
                key={property.id}
                className="property-card"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  animation: "fadeInUp 0.5s ease forwards",
                }}
            >
              <PropertyCard property={property} />
            </div>
        ))}
      </div>
  )
}

export default function HomePage() {
  return (
      <main>
        <HeroCarousel />

        <section id="featured-properties" className="container mx-auto py-16 px-4">
          <h2 className="mb-8 text-3xl font-bold">Featured Properties</h2>

          <Suspense fallback={<SkeletonProperty/>}>
            <FeaturedProperties />
          </Suspense>

          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/properties">View All Properties</Link>
            </Button>
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Why Choose Our Rentals</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center feature-card">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-primary"
                  >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Handpicked Properties</h3>
                <p className="text-muted-foreground">
                  We carefully select each property to ensure quality and comfort for our guests.
                </p>
              </div>
              <div className="text-center feature-card" style={{ animationDelay: "0.2s" }}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-primary"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Best Price Guarantee</h3>
                <p className="text-muted-foreground">
                  We offer competitive prices and special deals for our valued customers.
                </p>
              </div>
              <div className="text-center feature-card" style={{ animationDelay: "0.4s" }}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-primary"
                  >
                    <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z" />
                    <path d="M12 13v8" />
                    <path d="M5 13v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">24/7 Customer Support</h3>
                <p className="text-muted-foreground">
                  Our dedicated team is always available to assist you with any questions or concerns.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto py-16 px-4">
          <div className="rounded-xl bg-primary p-8 text-center text-white md:p-12">
            <h2 className="mb-4 text-3xl font-bold">Ready to Find Your Perfect Getaway?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg">
              Browse our selection of vacation rentals and book your dream destination today.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/properties">Explore All Properties</Link>
            </Button>
          </div>
        </section>
      </main>
  )
}
