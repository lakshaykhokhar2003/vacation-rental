import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    getAllProperties,
    getUserProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    getFeaturedProperties,
} from "@/lib/services/property-service"
import type { PropertyProps as Property } from "@/types"

export function useProperties() {
    return useQuery({
        queryKey: ["properties"],
        queryFn: () => getAllProperties(),
    })
}

export function useFeaturedProperties(count = 8) {
    return useQuery({
        queryKey: ["properties", "featured", count],
        queryFn: () => getFeaturedProperties(count),
    })
}

export function useProperty(propertyId: string, options = {}) {
    return useQuery({
        queryKey: ["properties", propertyId],
        queryFn: () => getProperty(propertyId),
        enabled: !!propertyId && propertyId !== "new",
        ...options,
    })
}

export function useUserProperties(userId: string | undefined,options = {}) {
    return useQuery({
        queryKey: ["properties", "user", userId],
        queryFn: () => getUserProperties(userId!),
        ...options
    })
}

export function useCreateProperty() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({propertyData,}: { propertyData: Omit<Property, "id">
        }) => createProperty(propertyData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["properties"] })
        },
    })
}

export function useUpdateProperty() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
                         propertyId,
                         propertyData,

                     }: {
            propertyId: string
            propertyData: Partial<Property>
            newImageFiles?: File[]
            deletedImageUrls?: string[]
        }) => updateProperty(propertyId, propertyData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["properties"] })
            queryClient.invalidateQueries({ queryKey: ["properties", variables.propertyId] })
        },
    })
}

export function useDeleteProperty() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (propertyId: string) => deleteProperty(propertyId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["properties"] })
        },
    })
}

