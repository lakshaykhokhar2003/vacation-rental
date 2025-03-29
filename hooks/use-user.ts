"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUser, createOrUpdateUser, uploadProfilePhoto, updateUserRole } from "@/lib/services/user-service"
import type { User } from "@/lib/services/user-service"

// Get a user by ID
export function useUser(userId: string | undefined) {
    return useQuery({
        queryKey: ["users", userId],
        queryFn: () => getUser(userId!),
        enabled: !!userId,
    })
}

// Create or update a user
export function useCreateOrUpdateUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userData: Partial<User>) => createOrUpdateUser(userData),
        onSuccess: (_, variables) => {
            if (variables.uid) {
                queryClient.invalidateQueries({ queryKey: ["users", variables.uid] })
            }
        },
    })
}

// Upload a profile photo
export function useUploadProfilePhoto() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
                         userId,
                         file,
                     }: {
            userId: string
            file: File
        }) => uploadProfilePhoto(userId, file),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["users", variables.userId] })
        },
    })
}

// Update user role
export function useUpdateUserRole() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
                         userId,
                         role,
                     }: {
            userId: string
            role: "guest" | "host" | "admin"
        }) => updateUserRole(userId, role),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["users", variables.userId] })
        },
    })
}

