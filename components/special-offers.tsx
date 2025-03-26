import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Offer {
  id: number
  title: string
  description: string
  image: string
  discount: string
}

interface SpecialOffersProps {
  offers: Offer[]
}

export function SpecialOffers({ offers }: SpecialOffersProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {offers.map((offer) => (
        <Link key={offer.id} href={`/offers/${offer.id}`}>
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src={offer.image || "/placeholder.svg"}
                alt={offer.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              <Badge className="absolute right-3 top-3 bg-primary text-lg font-bold">Save {offer.discount}</Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="mb-2 text-xl font-bold">{offer.title}</h3>
              <p className="text-muted-foreground">{offer.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

