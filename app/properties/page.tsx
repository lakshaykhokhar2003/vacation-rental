"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useProperties } from "@/hooks/use-properties"
import { PropertyCard } from "@/components/property/property-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function PropertiesPage() {
    const { data: properties, isLoading, error } = useProperties()
    const [searchQuery, setSearchQuery] = useState("")
    const [priceRange, setPriceRange] = useState<string>("all")
    const [sortBy, setSortBy] = useState<string>("recommended")

    const filteredProperties = properties?.filter((property) => {
        const matchesSearch =
            property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location.toLowerCase().includes(searchQuery.toLowerCase())

        let matchesPrice = true
        if (priceRange === "budget") {
            matchesPrice = property.price < 100
        } else if (priceRange === "mid") {
            matchesPrice = property.price >= 100 && property.price <= 300
        } else if (priceRange === "luxury") {
            matchesPrice = property.price > 300
        }

        return matchesSearch && matchesPrice
    })

    const sortedProperties = [...(filteredProperties || [])].sort((a, b) => {
        if (sortBy === "price-low") {
            return a.price - b.price
        } else if (sortBy === "price-high") {
            return b.price - a.price
        } else if (sortBy === "rating") {
            return b.rating - a.rating
        }
        return b.rating !== a.rating ? b.rating - a.rating : b.reviews - a.reviews
    })

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-bold mb-2">All Properties</h1>
                <p className="text-muted-foreground mb-8">Discover amazing vacation rentals for your next getaway</p>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by location or property name"
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>

                    <div className="flex gap-2">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recommended">Recommended</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                                <SelectItem value="rating">Top Rated</SelectItem>
                            </SelectContent>
                        </Select>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <SlidersHorizontal className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Filters</SheetTitle>
                                    <SheetDescription>Refine your search with these filters</SheetDescription>
                                </SheetHeader>
                                <div className="py-4 space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium">Price Range</h3>
                                        <Select value={priceRange} onValueChange={setPriceRange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All prices" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All prices</SelectItem>
                                                <SelectItem value="budget">Budget (under $100)</SelectItem>
                                                <SelectItem value="mid">Mid-range ($100-$300)</SelectItem>
                                                <SelectItem value="luxury">Luxury (over $300)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="flex flex-col space-y-3">
                                <Skeleton className="h-[200px] w-full rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold mb-2">Error loading properties</h2>
                        <p className="text-muted-foreground">Please try again later</p>
                    </div>
                ) : sortedProperties.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold mb-2">No properties found</h2>
                        <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {sortedProperties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}

