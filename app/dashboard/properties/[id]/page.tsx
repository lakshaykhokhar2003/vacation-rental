"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { PropertyForm } from "@/components/property/property-form"
import { useAuth } from "@/contexts/auth-context"
import { useProperty } from "@/hooks/use-properties"
import {use} from "react";

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const { data: property, isLoading: propertyLoading } = useProperty(id)

    const isLoading = authLoading || propertyLoading

    if (!isLoading && property && property.ownerId !== user?.uid) {
        router.push("/dashboard")
        return null
    }

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
                <h1 className="text-3xl font-bold">Edit Property</h1>
                <p className="text-muted-foreground">Update your property listing details</p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="mx-auto max-w-3xl">
                    <PropertyForm propertyId={id} />
                </div>
            )}
        </motion.div>
    )
}

