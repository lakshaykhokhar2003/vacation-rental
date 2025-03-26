import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  location: string
  comment: string
  rating: number
  image: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="mb-4 flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="mb-6 italic text-muted-foreground">"{testimonial.comment}"</p>
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

