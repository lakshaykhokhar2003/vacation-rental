import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import type {Booking} from "@/lib/services/bookings-service"
import {
    checkAvailability,
    createBooking,
    getBooking,
    getPropertyBookings,
    getUserBookings,
} from "@/lib/services/bookings-service"

export function useUserBookings(userId: string | undefined,options={}) {
    return useQuery({
        queryKey: ["bookings", "user", userId],
        queryFn: () => getUserBookings(userId!),
        ...options
    })
}

export function usePropertyBookings(propertyId: string) {
    return useQuery({
        queryKey: ["bookings", "property", propertyId],
        queryFn: () => getPropertyBookings(propertyId),
        enabled: !!propertyId,
    })
}

export function useBooking(bookingId: string) {
    return useQuery({
        queryKey: ["bookings", bookingId],
        queryFn: () => getBooking(bookingId),
        enabled: !!bookingId,
    })
}

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

