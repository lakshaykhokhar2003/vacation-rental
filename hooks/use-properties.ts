import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    getAllProperties,
    getUserProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    searchPropertiesByLocation,
    getFeaturedProperties,
} from "@/lib/services/property-service"
import type { Property } from "@/lib/services/property-service"

// Get all properties
export function useProperties() {
    return useQuery({
        queryKey: ["properties"],
        queryFn: () => getAllProperties(),
    })
}

// Get featured properties
export function useFeaturedProperties(count = 8) {
    return useQuery({
        queryKey: ["properties", "featured", count],
        queryFn: () => getFeaturedProperties(count),
    })
}

// Get a single property by ID
export function useProperty(propertyId: string) {
    return useQuery({
        queryKey: ["properties", propertyId],
        queryFn: () => getProperty(propertyId),
        enabled: !!propertyId && propertyId !== "new",
    })
}

// Get properties by user ID
export function useUserProperties(userId: string | undefined) {
    return useQuery({
        queryKey: ["properties", "user", userId],
        queryFn: () => getUserProperties(userId!),
        enabled: !!userId,
    })
}

// Search properties by location
export function useSearchProperties(location: string) {
    return useQuery({
        queryKey: ["properties", "search", location],
        queryFn: () => searchPropertiesByLocation(location),
        enabled: !!location,
    })
}

// Create a new property
export function useCreateProperty() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
                         propertyData,
                         imageFiles,
                     }: {
            propertyData: Omit<Property, "id">
            imageFiles: File[]
        }) => createProperty(propertyData, imageFiles),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["properties"] })
        },
    })
}

// Update a property
export function useUpdateProperty() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
                         propertyId,
                         propertyData,
                         newImageFiles,
                         deletedImageUrls,
                     }: {
            propertyId: string
            propertyData: Partial<Property>
            newImageFiles?: File[]
            deletedImageUrls?: string[]
        }) => updateProperty(propertyId, propertyData, newImageFiles, deletedImageUrls),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["properties"] })
            queryClient.invalidateQueries({ queryKey: ["properties", variables.propertyId] })
        },
    })
}

// Delete a property
export function useDeleteProperty() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (propertyId: string) => deleteProperty(propertyId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["properties"] })
        },
    })
}

