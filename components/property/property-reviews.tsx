"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Review {
  id: string
  name: string
  avatar: string
  date: string
  rating: number
  comment: string
}

interface PropertyReviewsProps {
  propertyId: string
}

export function PropertyReviews({ propertyId }: PropertyReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // In a real app, this would fetch from Firestore
        // For now, we'll use mock data

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockReviews: Review[] = [
          {
            id: "1",
            name: "Sarah Johnson",
            avatar: "/placeholder.svg?height=100&width=100",
            date: "August 2023",
            rating: 5,
            comment:
              "Absolutely stunning property! The views were breathtaking and the amenities were top-notch. We especially loved the infinity pool overlooking the ocean. The host was very responsive and provided excellent recommendations for local restaurants and activities. We will definitely be back!",
          },
          {
            id: "2",
            name: "David Chen",
            avatar: "/placeholder.svg?height=100&width=100",
            date: "July 2023",
            rating: 4,
            comment:
              "Great location and beautiful property. Very clean and well-maintained. The only reason for 4 stars instead of 5 is that the WiFi was a bit spotty during our stay. Otherwise, everything was perfect!",
          },
          {
            id: "3",
            name: "Emma Rodriguez",
            avatar: "/placeholder.svg?height=100&width=100",
            date: "June 2023",
            rating: 5,
            comment:
              "We had an amazing family vacation at this property. The beach access was perfect for the kids, and the kitchen had everything we needed to prepare meals. The host was very accommodating and even provided beach toys and chairs. Highly recommend!",
          },
        ]

        setReviews(mockReviews)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [propertyId])

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image src={review.avatar || "/placeholder.svg"} alt={review.name} fill className="object-cover" />
            </div>
            <div>
              <h4 className="font-medium">{review.name}</h4>
              <p className="text-sm text-muted-foreground">{review.date}</p>
            </div>
          </div>

          <div className="flex mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>

          <p className="text-muted-foreground">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}

