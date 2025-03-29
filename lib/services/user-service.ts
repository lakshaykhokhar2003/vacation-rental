import { db, storage } from "@/lib/firebase"
import { doc, getDoc, setDoc, updateDoc, Timestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export interface User {
    uid: string
    email: string
    displayName: string
    photoURL?: string
    phone?: string
    role: "guest" | "host" | "admin"
    createdAt: Timestamp
    updatedAt: Timestamp
}

// Create or update a user in Firestore
export const createOrUpdateUser = async (userData: Partial<User>): Promise<void> => {
    try {
        if (!userData.uid) {
            throw new Error("User ID is required")
        }

        const userRef = doc(db, "users", userData.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
            // Update existing user
            await updateDoc(userRef, {
                ...userData,
                updatedAt: Timestamp.now(),
            })
        } else {
            // Create new user
            await setDoc(userRef, {
                ...userData,
                role: userData.role || "guest",
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            })
        }
    } catch (error: any) {
        console.error("Error creating/updating user:", error)
        throw new Error(error.message || "Failed to create/update user")
    }
}

// Get a user by ID
export const getUser = async (userId: string): Promise<User | null> => {
    try {
        const userRef = doc(db, "users", userId)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) {
            return null
        }

        return {
            uid: userSnap.id,
            ...userSnap.data(),
        } as User
    } catch (error: any) {
        console.error("Error fetching user:", error)
        throw new Error(error.message || "Failed to fetch user")
    }
}

// Upload a profile photo
export const uploadProfilePhoto = async (userId: string, file: File): Promise<string> => {
    try {
        const imageName = `users/${userId}/profile-${Date.now()}.jpg`
        const storageRef = ref(storage, imageName)

        // Upload the file
        await uploadBytes(storageRef, file)

        // Get the download URL
        const downloadUrl = await getDownloadURL(storageRef)

        // Update the user document with the new photo URL
        const userRef = doc(db, "users", userId)
        await updateDoc(userRef, {
            photoURL: downloadUrl,
            updatedAt: Timestamp.now(),
        })

        return downloadUrl
    } catch (error: any) {
        console.error("Error uploading profile photo:", error)
        throw new Error(error.message || "Failed to upload profile photo")
    }
}

// Update user role
export const updateUserRole = async (userId: string, role: "guest" | "host" | "admin"): Promise<void> => {
    try {
        const userRef = doc(db, "users", userId)
        await updateDoc(userRef, {
            role,
            updatedAt: Timestamp.now(),
        })
    } catch (error: any) {
        console.error("Error updating user role:", error)
        throw new Error(error.message || "Failed to update user role")
    }
}

