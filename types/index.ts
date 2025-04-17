import {Timestamp} from "firebase/firestore";
import {User as UserAuth} from "firebase/auth";

export type BookingProperty = {
    id: string
    title: string
    price: number
    guests: number
    unavailableDates?: (string | Timestamp)[]
    isAvailable: boolean
}

export type BookingFormProps = {
    property: BookingProperty
}

export type PropertyAmenitiesProps = {
    amenities: string[]
}

export type Property ={
    id: string
    title: string
    location: string
    price: number
    rating: number
    reviews: number
    images?: string[]
    beds: number
    baths: number
    guests: number
    amenities: string[]
    isSuperhost: boolean
}

export type PropertyCardProps = {
    property: Property
}

export type PropertyFormProps = {
    propertyId?: string
}

export type PropertyGalleryProps = {
    images: string[]
}

export type PropertyProps = {
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

export type PropertyListProps = {
    properties?: PropertyProps[]
    isLoading?: boolean
    emptyMessage?: string
}

export type PropertyMapProps = {
    location: string
    coordinates: {
        lat: number
        lng: number
    }
}

export type Review = {
    id: string
    name: string
    avatar: string
    date: string
    rating: number
    comment: string
}

export type PropertyReviewsProps = {
    propertyId: string | number
}

export type Booking = {
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

export type BookingListProps = {
    bookings?: Booking[]
    isLoading?: boolean
    emptyMessage?: string
}

export type EmailTemplateProps = {
    bookingId: string;
    propertyTitle: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    total: number;
    guestName: string;
}

export type ImageUploadThingProps = {
    maxImages?: number
    value?: string[]
    onChange?: (urls: string[]) => void
    onRemove?: (url: string) => void
}

export type AuthContextType = {
    user: UserAuth | null
    loading: boolean
    signUp: (email: string, password: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    logOut: () => Promise<void>
}

export type User = {
    uid: string
    email: string
    displayName: string
    photoURL?: string
    phone?: string
    role: "guest" | "host" | "admin"
    createdAt: Timestamp
    updatedAt: Timestamp
}