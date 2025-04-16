"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const carouselImages = [
    "/hero/photo1.webp",
    "/hero/photo2.webp",
    "/hero/photo3.webp",
    "/hero/photo4.webp",
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
        <section className="relative h-[80vh] flex items-center justify-center">
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
                            sizes="(max-width: 768px) 45vw, (max-width: 1200px) 66vw, 100vw"
                            priority={index < 2}
                            quality={85}
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40"/>
                    </div>
                ))}
            </div>
            <div className="relative z-10 text-center px-4 text-white">
                <motion.h1
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl"
                >
                    Find Your Perfect Vacation Rental
                </motion.h1>
                <motion.p
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.1}}
                    className="mb-8 max-w-2xl text-lg md:text-xl"
                >
                    Discover amazing properties around the world for your next adventure
                </motion.p>
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.2}}
                >
                    <Button asChild size="lg" className="text-lg">
                        <Link href="/properties">Explore Properties</Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
