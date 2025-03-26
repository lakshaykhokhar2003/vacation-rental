import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"

interface Destination {
  id: number
  name: string
  image: string
  properties: number
}

interface FeaturedDestinationsProps {
  destinations: Destination[]
}

export function FeaturedDestinations({ destinations }: FeaturedDestinationsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((destination) => (
        <Link key={destination.id} href={`/destinations/${destination.id}`}>
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src={destination.image || "/placeholder.svg"}
                alt={destination.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-xl font-bold">{destination.name}</h3>
                <p className="text-sm">{destination.properties} properties</p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}

