export interface Booking {
    id: number
    propertyId: number
    property: {
        title: string
        image: string
        location: string
    }
    checkIn: string | Date
    checkOut: string | Date
    guests: number
    totalPrice: number
    status: "confirmed" | "pending" | "cancelled" | "completed"
    guestInfo: {
        firstName: string
        lastName: string
        email: string
        phone: string
    }
    createdAt: string | Date
}

