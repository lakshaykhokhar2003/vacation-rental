"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

import HeroImage1 from "@/public/hero/photo1.webp"
import HeroImage2 from "@/public/hero/photo1.webp"
import HeroImage3 from "@/public/hero/photo1.webp"
import HeroImage4 from "@/public/hero/photo1.webp"


const carouselImages = [
    HeroImage1,
    HeroImage2,
    HeroImage3,
    HeroImage4,
]

export function HeroCarousel() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1))
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            {carouselImages.map((image, index) => (
                <div
                    key={index}
                    className={cn(
                        "absolute inset-0 w-full h-full transition-opacity duration-1000",
                        index === currentImageIndex ? "opacity-100" : "opacity-0",
                    )}
                >
                    <Image
                        src={image || "/placeholder.svg"}
                        alt={`Vacation rental ${index + 1}`}
                        fill
                        sizes="100vw"
                        priority={index < 2}
                        quality={85}
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            ))}
        </div>
    )
}
