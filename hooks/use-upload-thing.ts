"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function useUploadThing() {
    const [isDeleting, setIsDeleting] = useState(false)
    const { toast } = useToast()

    const deleteFile = async (fileUrl: string): Promise<boolean> => {
        try {
            setIsDeleting(true)

            const fileKey = fileUrl.split("/").pop()

            if (!fileKey) {
                throw new Error("Could not extract file key from URL")
            }

            const response = await fetch(`/api/uploadthing/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileKey }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || "Failed to delete file")
            }

            return true
        } catch (error: any) {
            console.error("Error deleting file from UploadThing:", error)
            toast({
                title: "Error deleting file",
                description: error.message || "Failed to delete file from server",
                variant: "destructive",
            })
            return false
        } finally {
            setIsDeleting(false)
        }
    }

    return {
        deleteFile,
        isDeleting,
    }
}

