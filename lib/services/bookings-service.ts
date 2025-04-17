import {db} from "@/lib/firebase"
import {
    addDoc,
    collection,
    doc,
    type DocumentData,
    getDoc,
    getDocs,
    orderBy,
    query,
    type QueryDocumentSnapshot,
    Timestamp,
    where,
} from "firebase/firestore"
import {Booking} from "@/types";

export const createBooking = async (bookingData: Omit<Booking, "id">): Promise<string> => {
    try {
        if (!bookingData.createdAt) bookingData.createdAt = Timestamp.now()
        if (!bookingData.updatedAt) bookingData.updatedAt = Timestamp.now()

        const bookingsCollection = collection(db, "bookings")
        const docRef = await addDoc(bookingsCollection, bookingData)
        return docRef.id
    } catch (error: any) {
        console.error("Error creating booking:", error)
        throw new Error(error.message || "Failed to create booking")
    }
}

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


export const checkAvailability = async (propertyId: string | number, checkIn: Date, checkOut: Date): Promise<boolean> => {
    try {
        const bookingsCollection = collection(db, "bookings")

        const q = query(
            bookingsCollection,
            where("propertyId", "==", propertyId),
            where("status", "in", ["pending", "confirmed"]),
            where("checkOut", ">", Timestamp.fromDate(checkIn)),
        )

        const querySnapshot = await getDocs(q)

        for (const doc of querySnapshot.docs) {
            const booking = doc.data()
            const bookingCheckIn = booking.checkIn.toDate()
            const bookingCheckOut = booking.checkOut.toDate()

            if (
                (bookingCheckIn <= checkOut && bookingCheckOut >= checkIn) ||
                (checkIn <= bookingCheckOut && checkOut >= bookingCheckIn)
            ) {
                return false
            }
        }

        return true
    } catch (error: any) {
        console.error("Error checking availability:", error)
        throw new Error(error.message || "Failed to check availability")
    }
}

