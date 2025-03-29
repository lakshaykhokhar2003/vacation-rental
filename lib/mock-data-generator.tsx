"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { db, storage } from "@/lib/firebase"
import { collection, addDoc, doc, setDoc, Timestamp, getDoc } from "firebase/firestore"
import { ref } from "firebase/storage"
import { useAuth } from "@/contexts/auth-context"

// Sample property images as base64 strings (these would normally be actual images)
const sampleImages = [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
]

export function MockDataGenerator() {
    const [isGenerating, setIsGenerating] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)
    const { toast } = useToast()
    const router = useRouter()
    const { user } = useAuth()

    const generateMockData = async () => {
        if (!user) {
            setError("You must be logged in to generate mock data")
            toast({
                title: "Authentication Error",
                description: "You must be logged in to generate mock data",
                variant: "destructive",
            })
            return
        }

        // Verify if the user is the specified account
        if (user.email !== "lakshaykhokhar2003@gmail.com") {
            setError("Mock data can only be generated with the specified account")
            toast({
                title: "Authentication Error",
                description: "Mock data can only be generated with the specified account",
                variant: "destructive",
            })
            return
        }

        setIsGenerating(true)
        setError(null)
        setProgress(0)

        try {
            // Check if user exists in the users collection
            const userRef = doc(db, "users", user.uid)
            const userDoc = await getDoc(userRef)

            // If user doesn't exist in Firestore, create them
            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || "Lakshay",
                    photoURL: user.photoURL || "",
                    createdAt: Timestamp.now(),
                    role: "host", // Set as host to allow property management
                })
                console.log("Created user document for", user.email)
            }

            setProgress(10)

            // Generate properties
            const properties = await generateProperties(user.uid)
            setProgress(50)

            // Generate bookings for these properties
            await generateBookings(properties, user.uid)
            setProgress(100)

            setIsComplete(true)
            toast({
                title: "Mock Data Generated",
                description: "Sample properties and bookings have been created successfully.",
            })
        } catch (err: any) {
            console.error("Error generating mock data:", err)
            setError(err.message || "Failed to generate mock data")
            toast({
                title: "Error",
                description: err.message || "Failed to generate mock data",
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const generateProperties = async (userId: string) => {
        const propertyIds: string[] = []
        const locations = [
            { name: "Malibu, California", lat: 34.0259, lng: -118.7798 },
            { name: "Aspen, Colorado", lat: 39.1911, lng: -106.8175 },
            { name: "Miami Beach, Florida", lat: 25.7907, lng: -80.13 },
            { name: "Lake Tahoe, Nevada", lat: 39.0968, lng: -120.0324 },
            { name: "Santorini, Greece", lat: 36.3932, lng: 25.4615 },
        ]

        const propertyTypes = ["Beach House", "Mountain Cabin", "City Apartment", "Lakefront Cottage", "Villa"]

        // Create 5 sample properties
        for (let i = 0; i < 5; i++) {
            try {
                const location = locations[i]
                const propertyType = propertyTypes[i]
                const guestCapacity = Math.floor(Math.random() * 8) + 2 // 2-10 guests

                // Upload sample images and get URLs
                const imageUrls = []
                for (const image of sampleImages) {
                    const imageName = `properties/${userId}/${Date.now()}-${i}-${imageUrls.length}.jpg`
                    const storageRef = ref(storage, imageName)

                    // In a real implementation, we would upload actual images
                    // For this mock, we'll just use the placeholder URLs directly
                    imageUrls.push(image)
                }

                // Create property document
                const propertyData = {
                    ownerId: userId,
                    title: `${propertyType} in ${location.name}`,
                    description: `Experience this beautiful ${propertyType.toLowerCase()} in ${location.name}. Perfect for families and groups, this property offers stunning views and all the amenities you need for a comfortable stay.`,
                    location: location.name,
                    coordinates: {
                        lat: location.lat,
                        lng: location.lng,
                    },
                    price: Math.floor(Math.random() * 300) + 100, // $100-$400 per night
                    images: imageUrls,
                    beds: Math.floor(Math.random() * 4) + 1, // 1-5 beds
                    baths: Math.floor(Math.random() * 3) + 1, // 1-4 baths
                    guests: guestCapacity,
                    amenities: [
                        "WiFi",
                        "Kitchen",
                        "Free Parking",
                        "Air Conditioning",
                        i % 2 === 0 ? "Pool" : "Hot Tub",
                        "TV",
                        i % 3 === 0 ? "Beach Access" : "Mountain View",
                    ],
                    isSuperhost: i % 2 === 0, // Every other property has a superhost
                    rating: Math.random() * 1.5 + 3.5, // 3.5-5.0 rating
                    reviews: Math.floor(Math.random() * 100) + 5, // 5-105 reviews
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                    isAvailable: true,
                }

                const propertyRef = await addDoc(collection(db, "properties"), propertyData)
                propertyIds.push(propertyRef.id)
                console.log(`Created property: ${propertyData.title}`)
            } catch (err) {
                console.error("Error creating property:", err)
                throw err
            }
        }

        return propertyIds
    }

    const generateBookings = async (propertyIds: string[], userId: string) => {
        // Create 10 sample bookings
        for (let i = 0; i < 10; i++) {
            try {
                const propertyId = propertyIds[i % propertyIds.length] // Cycle through properties

                // Generate random dates in the future
                const today = new Date()
                const futureDate = new Date()
                futureDate.setDate(today.getDate() + i * 15 + Math.floor(Math.random() * 30)) // Spread out over next few months

                const checkIn = new Date(futureDate)
                const checkOut = new Date(futureDate)
                checkOut.setDate(checkIn.getDate() + Math.floor(Math.random() * 7) + 2) // 2-9 day stay

                const guestCount = Math.floor(Math.random() * 4) + 1 // 1-5 guests

                // Generate guest names
                const guestNames = []
                for (let j = 0; j < guestCount; j++) {
                    if (j === 0) {
                        // First guest is the user
                        guestNames.push(user?.displayName || "Lakshay")
                    } else {
                        guestNames.push(`Guest ${j}`)
                    }
                }

                // Create booking document
                const bookingData = {
                    propertyId,
                    userId,
                    checkIn: Timestamp.fromDate(checkIn),
                    checkOut: Timestamp.fromDate(checkOut),
                    guests: guestCount,
                    totalPrice: Math.floor(Math.random() * 1000) + 500, // $500-$1500 total
                    status: ["pending", "confirmed", "completed"][Math.floor(Math.random() * 3)],
                    guestInfo: {
                        name: user?.displayName || "Lakshay",
                        email: user?.email,
                        phone: "+1234567890", // Mock phone number
                    },
                    guestNames: guestNames,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                }

                await addDoc(collection(db, "bookings"), bookingData)
                console.log(`Created booking for property ${propertyId}`)
            } catch (err) {
                console.error("Error creating booking:", err)
                throw err
            }
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Generate Mock Data</CardTitle>
    <CardDescription>Create sample properties and bookings for testing purposes.</CardDescription>
    </CardHeader>
    <CardContent>
    {isComplete ? (
            <div className="flex flex-col items-center justify-center py-4">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-center text-lg font-medium">Mock data generated successfully!</p>
            <p className="text-center text-muted-foreground mt-2">5 properties and 10 bookings have been created.</p>
            </div>
) : error ? (
        <div className="flex flex-col items-center justify-center py-4">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-center text-lg font-medium">Error generating mock data</p>
    <p className="text-center text-muted-foreground mt-2">{error}</p>
        </div>
) : isGenerating ? (
        <div className="flex flex-col items-center justify-center py-4">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
        <p className="text-center text-lg font-medium">Generating mock data...</p>
    <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4">
    <div
        className="bg-primary h-2.5 rounded-full transition-all duration-300"
    style={{ width: `${progress}%` }}
></div>
    </div>
    <p className="text-center text-sm text-muted-foreground mt-2">This may take a few moments</p>
    </div>
) : (
        <div className="py-4">
        <p className="mb-4">
            This will create sample properties and bookings associated with your account for testing purposes.
    </p>
    <p className="text-sm text-muted-foreground mb-4">
        Note: This action will add new data to your Firebase database.
    </p>
    {!user && <p className="text-amber-600 text-sm mb-4">You must be logged in to generate mock data.</p>}
        {user && user.email !== "lakshaykhokhar2003@gmail.com" && (
            <p className="text-amber-600 text-sm mb-4">
                Mock data can only be generated with the specified account (lakshaykhokhar2003@gmail.com).
            </p>
        )}
        </div>
    )}
    </CardContent>
    <CardFooter className="flex justify-between">
        {isComplete ? (
                <Button className="w-full" onClick={() => router.push("/dashboard")}>
    Go to Dashboard
    </Button>
) : (
        <>
            <Button variant="outline" onClick={() => router.push("/")} disabled={isGenerating}>
        Cancel
        </Button>
        <Button
    onClick={generateMockData}
    disabled={isGenerating || !user || user.email !== "lakshaykhokhar2003@gmail.com"}
>
    {isGenerating ? "Generating..." : "Generate Mock Data"}
    </Button>
    </>
)}
    </CardFooter>
    </Card>
)
}

