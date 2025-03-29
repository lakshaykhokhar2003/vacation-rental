import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    getUserBookings,
    getPropertyBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
    updateBookingStatus,
    checkAvailability,
} from "@/lib/services/bookings-service"
import type { Booking } from "@/lib/services/bookings-service"

// Get bookings by user ID
export function useUserBookings(userId: string | undefined) {
    return useQuery({
        queryKey: ["bookings", "user", userId],
        queryFn: () => getUserBookings(userId!),
        enabled: !!userId,
    })
}

// Get bookings by property ID
export function usePropertyBookings(propertyId: string) {
    return useQuery({
        queryKey: ["bookings", "property", propertyId],
        queryFn: () => getPropertyBookings(propertyId),
        enabled: !!propertyId,
    })
}

// Get a single booking by ID
export function useBooking(bookingId: string) {
    return useQuery({
        queryKey: ["bookings", bookingId],
        queryFn: () => getBooking(bookingId),
        enabled: !!bookingId,
    })
}

// Create a new booking
export function useCreateBooking() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (bookingData: Omit<Booking, "id">) => createBooking(bookingData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] })
            queryClient.invalidateQueries({ queryKey: ["bookings", "user", variables.userId] })
            queryClient.invalidateQueries({ queryKey: ["bookings", "property", variables.propertyId] })
        },
    })
}

// Update a booking
export function useUpdateBooking() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
                         bookingId,
                         bookingData,
                     }: {
            bookingId: string
            bookingData: Partial<Booking>
        }) => updateBooking(bookingId, bookingData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] })
            queryClient.invalidateQueries({ queryKey: ["bookings", variables.bookingId] })
        },
    })
}

// Delete a booking
export function useDeleteBooking() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (bookingId: string) => deleteBooking(bookingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] })
        },
    })
}

// Update booking status
export function useUpdateBookingStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
                         bookingId,
                         status,
                     }: {
            bookingId: string
            status: "pending" | "confirmed" | "cancelled" | "completed"
        }) => updateBookingStatus(bookingId, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] })
            queryClient.invalidateQueries({ queryKey: ["bookings", variables.bookingId] })
        },
    })
}

// Check property availability
export function useCheckAvailability() {
    return useMutation({
        mutationFn: ({
                         propertyId,
                         checkIn,
                         checkOut,
                     }: {
            propertyId: string | number
            checkIn: Date
            checkOut: Date
        }) => checkAvailability(propertyId, checkIn, checkOut),
    })
}

