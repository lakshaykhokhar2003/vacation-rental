"use client"

import {useRouter} from "next/navigation"
import {motion} from "framer-motion"
import {Button} from "@/components/ui/button"
import {ArrowLeft} from "lucide-react"
import {PropertyForm} from "@/components/property/property-form"

export default function NewPropertyPage() {
    const router = useRouter()

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container py-8 px-4"
        >
            <div className="mb-8">
                <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <h1 className="text-3xl font-bold">Add New Property</h1>
                <p className="text-muted-foreground">Fill in the details to create a new property listing</p>
            </div>

            <div className="mx-auto max-w-3xl">
                <PropertyForm propertyId="new" />
            </div>
        </motion.div>
    )
}

