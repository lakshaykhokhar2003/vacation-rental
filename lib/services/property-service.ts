import {db} from "@/lib/firebase"
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    type DocumentData,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    type QueryDocumentSnapshot,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore"

import type {PropertyProps as Property} from "@/types"

export const createProperty = async (propertyData: Omit<Property, "id">): Promise<string> => {
    try {
        const propertyWithTimestamps = {
            ...propertyData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        }

        const docRef = await addDoc(collection(db, "properties"), propertyWithTimestamps)

        return docRef.id
    } catch (error: any) {
        console.error("Error creating property:", error)
        throw new Error(error.message || "Failed to create property")
    }
}

export const getProperty = async (propertyId: string): Promise<Property> => {
    try {
        const propertyRef = doc(db, "properties", propertyId)
        const propertySnap = await getDoc(propertyRef)

        if (!propertySnap.exists()) {
            throw new Error("Property not found")
        }

        return {
            id: propertySnap.id,
            ...propertySnap.data(),
        } as Property
    } catch (error: any) {
        console.error("Error fetching property:", error)
        throw new Error(error.message || "Failed to fetch property")
    }
}

export const getAllProperties = async (): Promise<Property[]> => {
    try {
        const propertiesCollection = collection(db, "properties")
        const q = query(propertiesCollection, orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)

        return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...doc.data(),
        })) as Property[]
    } catch (error: any) {
        console.error("Error fetching properties:", error)
        throw new Error(error.message || "Failed to fetch properties")
    }
}

export const getUserProperties = async (userId: string): Promise<Property[]> => {
    try {
        const propertiesCollection = collection(db, "properties")
        const q = query(propertiesCollection, where("ownerId", "==", userId), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)

        return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...doc.data(),
        })) as Property[]
    } catch (error: any) {
        console.error("Error fetching user properties:", error)
        throw new Error(error.message || "Failed to fetch properties")
    }
}

export const updateProperty = async (
    propertyId: string,
    propertyData: Partial<Property>,
): Promise<void> => {
    try {
        const propertyRef = doc(db, "properties", propertyId)
        propertyData.updatedAt = Timestamp.now()
        await updateDoc(propertyRef, propertyData)
    } catch (error: any) {
        console.error("Error updating property:", error)
        throw new Error(error.message || "Failed to update property")
    }
}

export const deleteProperty = async (propertyId: string): Promise<void> => {
    try {
        const propertyRef = doc(db, "properties", propertyId)
        const propertySnap = await getDoc(propertyRef)

        if (!propertySnap.exists()) {
            throw new Error("Property not found")
        }

        const propertyData = propertySnap.data() as Property

        if (propertyData.images && propertyData.images.length > 0) {
            for (const imageUrl of propertyData.images) {
                try {
                    const fileKey = imageUrl.split("/").pop()
                    if (fileKey) {
                        await fetch("/api/uploadthing/delete", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({fileKey}),
                        })
                    }
                } catch (err) {
                    console.warn("Error deleting image, it may not exist:", err)
                }
            }
        }


        await deleteDoc(propertyRef)
    } catch (error: any) {
        console.error("Error deleting property:", error)
        throw new Error(error.message || "Failed to delete property")
    }
}

export const getFeaturedProperties = async (count = 8): Promise<Property[]> => {
    try {
        const propertiesCollection = collection(db, "properties")
        const q = query(propertiesCollection, where("isAvailable", "==", true), orderBy("rating", "desc"), limit(count))
        const querySnapshot = await getDocs(q)

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Property[]
    } catch (error: any) {
        console.error("Error fetching featured properties:", error)
        throw new Error(error.message || "Failed to fetch featured properties")
    }
}

