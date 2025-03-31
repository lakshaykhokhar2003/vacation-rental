"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MockDataGenerator } from "@/lib/mock-data-generator"
import { useAuth } from "@/contexts/auth-context"

export default function GenerateMockDataPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }

        if (!loading && user && user.email !== "lakshaykhokhar2003@gmail.com") {
            router.push("/dashboard")
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="container mx-auto py-16 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-lg">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user || user.email !== "lakshaykhokhar2003@gmail.com") {
        return (
            <div className="container mx-auto py-16 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
                <p className="mb-8">Only the specified account can access this page.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-16 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Generate Mock Data</h1>
            <MockDataGenerator />
        </div>
    )
}

