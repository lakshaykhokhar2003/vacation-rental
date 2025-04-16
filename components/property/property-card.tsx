"use client"

import type React from "react"

import {useState, useEffect, useRef} from "react"
import Image from "next/image"
import Link from "next/link"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter} from "@/components/ui/card"
import {Bed, Bath, Users, Heart, Star, ChevronLeft, ChevronRight, MapPin} from "lucide-react"
import {useRouter} from "next/navigation";

interface Property {
    id: number | string
    title: string
    location: string
    price: number
    rating: number
    reviews: number
    images?: string[]
    beds: number
    baths: number
    guests: number
    amenities: string[]
    isSuperhost: boolean
}

interface PropertyCardProps {
    property: Property
}

export function PropertyCard({property}: PropertyCardProps) {
    const router = useRouter()
    const [isFavorite, setIsFavorite] = useState(false)

    const allImages =
        property.images && property.images.length > 0
            ? property.images
            : ["/placeholder.svg?height=500&width=800", "/placeholder.svg?height=500&width=800"]

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        if (allImages.length > 1 && !isPaused) {
            autoRotateTimerRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
            }, 5000)
        }

        return () => {
            if (autoRotateTimerRef.current) {
                clearInterval(autoRotateTimerRef.current)
            }
        }
    }, [allImages.length, isPaused])

    const pauseAutoRotation = () => setIsPaused(true)


    const resumeAutoRotation = () => setIsPaused(false)

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
    }

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
    }

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsFavorite(!isFavorite)
    }

    return (
        <Card className="group overflow-hidden transition-all hover:shadow-md">
            <div
                className="relative aspect-square w-full overflow-hidden"
                onMouseEnter={pauseAutoRotation}
                onMouseLeave={resumeAutoRotation}
            >
                    <Image
                        src={allImages[currentImageIndex] || "/placeholder.svg"}
                        alt={property.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                        priority
                        sizes="(max-width: 768px) 66vw, (max-width: 1200px) 50vw, 60vw"
                        onClick={()=> router.push(`/property/${property.id}`)}
                    />

                {allImages.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 opacity-0 shadow transition-opacity group-hover:opacity-100"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="h-5 w-5"/>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 opacity-0 shadow transition-opacity group-hover:opacity-100"
                            onClick={nextImage}
                        >
                            <ChevronRight className="h-5 w-5"/>
                        </Button>
                    </>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white/80 shadow"
                    onClick={toggleFavorite}
                >
                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}/>
                </Button>

                {property.isSuperhost && (
                    <Badge className="absolute left-2 top-2 z-10 bg-white text-primary select-none">Superhost</Badge>
                )}

                {allImages.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
                        {allImages.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 w-1.5 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400"/>
                        <span className="text-sm font-medium">{property.rating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">({property.reviews} reviews)</span>
                    </div>
                </div>

                <h3 className="mb-1 text-lg font-semibold line-clamp-1">{property.title}</h3>

                <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3"/>
                    <span>{property.location}</span>
                </div>

                <div className="mb-3 flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4 text-muted-foreground"/>
                        <span>
                {property.beds} {property.beds === 1 ? "bed" : "beds"}
              </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4 text-muted-foreground"/>
                        <span>
                {property.baths} {property.baths === 1 ? "bath" : "baths"}
              </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground"/>
                        <span>{property.guests} guests</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="outline" className="bg-slate-50">
                            {amenity}
                        </Badge>
                    ))}
                    {property.amenities.length > 3 && (
                        <Badge variant="outline" className="bg-slate-50">
                            +{property.amenities.length - 3} more
                        </Badge>
                    )}
                </div>
            </CardContent>

            <CardFooter className="border-t p-4">
                <div className="flex w-full items-center justify-between">
                    <div>
                        <span className="text-xl font-bold">${property.price}</span>
                        <span className="text-muted-foreground"> / night</span>
                    </div>
                    <Link href={`/property/${property.id}`} className="block">
                        <Button size="sm">View Details</Button>
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}

