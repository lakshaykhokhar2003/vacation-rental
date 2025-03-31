"use client"

import {useQuery} from "@tanstack/react-query"
import {getUser} from "@/lib/services/user-service"

export function useUser(userId: string | undefined) {
    return useQuery({
        queryKey: ["users", userId],
        queryFn: () => getUser(userId!),
        enabled: !!userId,
    })
}

// export function useCreateOrUpdateUser() {
//     const queryClient = useQueryClient()
//
//     return useMutation({
//         mutationFn: (userData: Partial<User>) => createOrUpdateUser(userData),
//         onSuccess: (_, variables) => {
//             if (variables.uid) {
//                 queryClient.invalidateQueries({ queryKey: ["users", variables.uid] })
//             }
//         },
//     })
// }
