"use client"

import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { useAuth } from "@/contexts/auth-context"

// Upload a single file to Firebase Storage
export const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
        // Create storage reference
        const storageRef = ref(storage, path)

        // Set metadata to avoid CORS issues
        const metadata = {
            contentType: file.type,
            customMetadata: {
                "Access-Control-Allow-Origin": "*",
            },
        }

        // Upload the file with metadata
        await uploadBytes(storageRef, file, metadata)

        // Get the download URL
        const downloadUrl = await getDownloadURL(storageRef)
        return downloadUrl
    } catch (error: any) {
        console.error("Error uploading file:", error)
        throw new Error(error.message || "Failed to upload file")
    }
}

// Upload multiple files to Firebase Storage
export const uploadMultipleFiles = async (files: File[], basePath: string): Promise<string[]> => {
    try {
        const uploadPromises = files.map(async (file, index) => {
            const path = `${basePath}/${Date.now()}-${index}-${file.name}`
            return await uploadFile(file, path)
        })

        return await Promise.all(uploadPromises)
    } catch (error: any) {
        console.error("Error uploading multiple files:", error)
        throw new Error(error.message || "Failed to upload files")
    }
}

// Delete a file from Firebase Storage
export const deleteFile = async (url: string): Promise<void> => {
    try {
        // Extract the path from the URL
        if (!url.includes("firebasestorage.googleapis.com")) {
            console.warn("Not a Firebase Storage URL, skipping deletion")
            return
        }

        const urlPath = decodeURIComponent(url.split("/o/")[1].split("?")[0])
        const fileRef = ref(storage, urlPath)

        await deleteObject(fileRef)
    } catch (error: any) {
        console.error("Error deleting file:", error)
        throw new Error(error.message || "Failed to delete file")
    }
}

// Delete multiple files from Firebase Storage
export const deleteMultipleFiles = async (urls: string[]): Promise<void> => {
    try {
        const deletePromises = urls.map(async (url) => {
            await deleteFile(url)
        })

        await Promise.all(deletePromises)
    } catch (error: any) {
        console.error("Error deleting multiple files:", error)
        throw new Error(error.message || "Failed to delete files")
    }
}

// Custom hook for file operations that includes the current user
export function useFileService() {
    const { user } = useAuth()

    const uploadFileForUser = async (file: File, basePath: string) => {
        if (!user) {
            throw new Error("User must be logged in to upload files")
        }

        const path = `${basePath}/${user.uid}/${Date.now()}-${file.name}`
        return await uploadFile(file, path)
    }

    const uploadMultipleFilesForUser = async (files: File[], basePath: string) => {
        if (!user) {
            throw new Error("User must be logged in to upload files")
        }

        const userBasePath = `${basePath}/${user.uid}`
        return await uploadMultipleFiles(files, userBasePath)
    }

    return {
        uploadFile: uploadFileForUser,
        uploadMultipleFiles: uploadMultipleFilesForUser,
        deleteFile,
        deleteMultipleFiles,
    }
}

