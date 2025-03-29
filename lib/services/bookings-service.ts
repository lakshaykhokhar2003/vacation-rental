import { db } from "@/lib/firebase"
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

export interface Booking {
    id: string
    propertyId: string
    userId: string
    checkIn: Timestamp
    checkOut: Timestamp
    guests: number
    totalPrice: number
    status: "pending" | "confirmed" | "cancelled" | "completed"
    guestInfo: {
        name: string
        email: string
        phone?: string
    }
    guestNames?: string[]
    paymentInfo?: {
        paymentId: string
        paymentMethod: string
        paymentStatus: string
    }
    createdAt?: Timestamp
    updatedAt?: Timestamp
}

// Create a new booking
export const createBooking = async (bookingData: Omit<Booking, "id">): Promise<string> => {
    try {
        // Add timestamps if not provided
        if (!bookingData.createdAt) {
            bookingData.createdAt = Timestamp.now()
        }
        if (!bookingData.updatedAt) {
            bookingData.updatedAt = Timestamp.now()
        }

        const bookingsCollection = collection(db, "bookings")
        const docRef = await addDoc(bookingsCollection, bookingData)
        return docRef.id
    } catch (error: any) {
        console.error("Error creating booking:", error)
        throw new Error(error.message || "Failed to create booking")
    }
}

// Get a booking by ID
export const getBooking = async (bookingId: string): Promise<Booking> => {
    try {
        const bookingRef = doc(db, "bookings", bookingId)
        const bookingSnap = await getDoc(bookingRef)

        if (!bookingSnap.exists()) {
            throw new Error("Booking not found")
        }

        return {
            id: bookingSnap.id,
            ...bookingSnap.data(),
        } as Booking
    } catch (error: any) {
        console.error("Error fetching booking:", error)
        throw new Error(error.message || "Failed to fetch booking")
    }
}

// Update a booking
export const updateBooking = async (bookingId: string, bookingData: Partial<Booking>): Promise<void> => {
    try {
        const bookingRef = doc(db, "bookings", bookingId)

        // Add updated timestamp
        bookingData.updatedAt = Timestamp.now()

        await updateDoc(bookingRef, bookingData)
    } catch (error: any) {
        console.error("Error updating booking:", error)
        throw new Error(error.message || "Failed to update booking")
    }
}

// Delete a booking
export const deleteBooking = async (bookingId: string): Promise<void> => {
    try {
        const bookingRef = doc(db, "bookings", bookingId)
        await deleteDoc(bookingRef)
    } catch (error: any) {
        console.error("Error deleting booking:", error)
        throw new Error(error.message || "Failed to delete booking")
    }
}

// Get bookings by user ID
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
    try {
        const bookingsCollection = collection(db, "bookings")
        const q = query(bookingsCollection, where("userId", "==", userId), orderBy("checkIn", "desc"))

        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...doc.data(),
        })) as Booking[]
    } catch (error: any) {
        console.error("Error fetching user bookings:", error)
        throw new Error(error.message || "Failed to fetch bookings")
    }
}

// Get bookings by property ID
export const getPropertyBookings = async (propertyId: string): Promise<Booking[]> => {
    try {
        const bookingsCollection = collection(db, "bookings")
        const q = query(bookingsCollection, where("propertyId", "==", propertyId), orderBy("checkIn", "desc"))

        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Booking[]
    } catch (error: any) {
        console.error("Error fetching property bookings:", error)
        throw new Error(error.message || "Failed to fetch bookings")
    }
}

// Get recent bookings
export const getRecentBookings = async (limitCount = 5): Promise<Booking[]> => {
    try {
        const bookingsCollection = collection(db, "bookings")
        const q = query(bookingsCollection, orderBy("createdAt", "desc"), limit(limitCount))

        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Booking[]
    } catch (error: any) {
        console.error("Error fetching recent bookings:", error)
        throw new Error(error.message || "Failed to fetch bookings")
    }
}

// Check availability for a property
export const checkAvailability = async (propertyId: string | number, checkIn: Date, checkOut: Date): Promise<boolean> => {
    try {
        const bookingsCollection = collection(db, "bookings")

        // Query for any bookings that overlap with the requested dates
        const q = query(
            bookingsCollection,
            where("propertyId", "==", propertyId),
            where("status", "in", ["pending", "confirmed"]),
            where("checkOut", ">", Timestamp.fromDate(checkIn)),
        )

        const querySnapshot = await getDocs(q)

        // Check if any of the bookings overlap with the requested dates
        for (const doc of querySnapshot.docs) {
            const booking = doc.data()
            const bookingCheckIn = booking.checkIn.toDate()
            const bookingCheckOut = booking.checkOut.toDate()

            // Check if there's an overlap
            if (
                (bookingCheckIn <= checkOut && bookingCheckOut >= checkIn) ||
                (checkIn <= bookingCheckOut && checkOut >= bookingCheckIn)
            ) {
                return false // There's an overlap, not available
            }
        }

        return true // No overlaps found, available
    } catch (error: any) {
        console.error("Error checking availability:", error)
        throw new Error(error.message || "Failed to check availability")
    }
}

// Update booking status
export const updateBookingStatus = async (
    bookingId: string,
    status: "pending" | "confirmed" | "cancelled" | "completed",
): Promise<void> => {
    try {
        const bookingRef = doc(db, "bookings", bookingId)

        await updateDoc(bookingRef, {
            status,
            updatedAt: Timestamp.now(),
        })
    } catch (error: any) {
        console.error("Error updating booking status:", error)
        throw new Error(error.message || "Failed to update booking status")
    }
}

