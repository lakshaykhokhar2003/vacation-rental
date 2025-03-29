import { db, storage } from "@/lib/firebase"
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    type DocumentData,
    type QueryDocumentSnapshot,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

export interface Property {
    id: string
    ownerId: string
    title: string
    description: string
    location: string
    coordinates: {
        lat: number
        lng: number
    }
    price: number
    images: string[]
    beds: number
    baths: number
    guests: number
    amenities: string[]
    isSuperhost: boolean
    rating: number
    reviews: number
    createdAt: any
    updatedAt: any
    isAvailable: boolean
}

// Create a new property
export const createProperty = async (propertyData: Omit<Property, "id">, imageFiles: File[]): Promise<string> => {
    try {
        // Upload images to Firebase Storage
        const imageUrls = await Promise.all(
            imageFiles.map(async (file) => {
                const imageName = `properties/${propertyData.ownerId}/${Date.now()}-${file.name}`
                const storageRef = ref(storage, imageName)

                // Upload the file
                await uploadBytes(storageRef, file)

                // Get the download URL
                const downloadUrl = await getDownloadURL(storageRef)
                return downloadUrl
            }),
        )

        // Add timestamps
        const propertyWithImages = {
            ...propertyData,
            images: imageUrls,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        }

        // Add to Firestore
        const docRef = await addDoc(collection(db, "properties"), propertyWithImages)
        return docRef.id
    } catch (error: any) {
        console.error("Error creating property:", error)
        throw new Error(error.message || "Failed to create property")
    }
}

// Get a property by ID
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

// Get all properties
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

// Get properties by owner ID
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

// Update a property
export const updateProperty = async (
    propertyId: string,
    propertyData: Partial<Property>,
    newImageFiles?: File[],
    deletedImageUrls?: string[],
): Promise<void> => {
    try {
        const propertyRef = doc(db, "properties", propertyId)

        // Handle image updates if provided
        if (newImageFiles && newImageFiles.length > 0) {
            // Upload new images
            const newImageUrls = await Promise.all(
                newImageFiles.map(async (file) => {
                    const imageName = `properties/${propertyData.ownerId}/${Date.now()}-${file.name}`
                    const storageRef = ref(storage, imageName)

                    await uploadBytes(storageRef, file)
                    return await getDownloadURL(storageRef)
                }),
            )

            // Get current property data to merge with existing images
            const propertySnap = await getDoc(propertyRef)
            if (!propertySnap.exists()) {
                throw new Error("Property not found")
            }

            const currentProperty = propertySnap.data() as Property
            let updatedImages = [...currentProperty.images]

            // Remove deleted images if specified
            if (deletedImageUrls && deletedImageUrls.length > 0) {
                // Delete from Storage
                for (const imageUrl of deletedImageUrls) {
                    try {
                        // Extract the path from the URL
                        const urlPath = decodeURIComponent(imageUrl.split("/o/")[1].split("?")[0])
                        const imageRef = ref(storage, urlPath)
                        await deleteObject(imageRef)
                    } catch (err) {
                        console.warn("Error deleting image, it may not exist:", err)
                    }
                }

                // Filter out deleted images
                updatedImages = updatedImages.filter((url) => !deletedImageUrls.includes(url))
            }

            // Add new images
            updatedImages = [...updatedImages, ...newImageUrls]

            // Update property data with new images
            propertyData.images = updatedImages
        }

        // Add updated timestamp
        propertyData.updatedAt = Timestamp.now()

        // Update in Firestore
        await updateDoc(propertyRef, propertyData)
    } catch (error: any) {
        console.error("Error updating property:", error)
        throw new Error(error.message || "Failed to update property")
    }
}

// Delete a property
export const deleteProperty = async (propertyId: string): Promise<void> => {
    try {
        // Get property data to delete images
        const propertyRef = doc(db, "properties", propertyId)
        const propertySnap = await getDoc(propertyRef)

        if (!propertySnap.exists()) {
            throw new Error("Property not found")
        }

        const propertyData = propertySnap.data() as Property

        // Delete images from Storage
        if (propertyData.images && propertyData.images.length > 0) {
            for (const imageUrl of propertyData.images) {
                try {
                    // Extract the path from the URL
                    const urlPath = decodeURIComponent(imageUrl.split("/o/")[1].split("?")[0])
                    const imageRef = ref(storage, urlPath)
                    await deleteObject(imageRef)
                } catch (err) {
                    console.warn("Error deleting image, it may not exist:", err)
                }
            }
        }

        // Delete from Firestore
        await deleteDoc(propertyRef)
    } catch (error: any) {
        console.error("Error deleting property:", error)
        throw new Error(error.message || "Failed to delete property")
    }
}

// Search properties by location
export const searchPropertiesByLocation = async (location: string): Promise<Property[]> => {
    try {
        const propertiesCollection = collection(db, "properties")
        // Using a simple contains search - in a real app, you might use a more sophisticated search
        const q = query(
            propertiesCollection,
            where("location", ">=", location),
            where("location", "<=", location + "\uf8ff"),
        )
        const querySnapshot = await getDocs(q)

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Property[]
    } catch (error: any) {
        console.error("Error searching properties:", error)
        throw new Error(error.message || "Failed to search properties")
    }
}

// Get featured properties
export const getFeaturedProperties = async (count = 6): Promise<Property[]> => {
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

