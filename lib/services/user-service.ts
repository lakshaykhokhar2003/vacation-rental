import {db} from "@/lib/firebase"
import {doc, getDoc, setDoc, Timestamp, updateDoc} from "firebase/firestore"
import {User} from "@/types";

export const createOrUpdateUser = async (userData: Partial<User>): Promise<void> => {
    try {
        if (!userData.uid) {
            throw new Error("User ID is required")
        }

        const userRef = doc(db, "users", userData.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
            await updateDoc(userRef, {
                ...userData,
                updatedAt: Timestamp.now(),
            })
        } else {
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

