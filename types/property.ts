export interface Property {
    id: number | string
    title: string
    description?: string
    location: string
    price: number
    rating: number
    reviews: number
    image: string
    images?: string[]
    beds: number
    baths: number
    guests: number
    amenities: string[]
    isSuperhost: boolean
    type?: string
    status?: string
    host?: {
        name: string
        image?: string
        since?: string
    }
    reviewsList?: Review[]
}

export interface Review {
    id: number
    user: {
        name: string
        image: string
    }
    rating: number
    date: string
    comment: string
}

