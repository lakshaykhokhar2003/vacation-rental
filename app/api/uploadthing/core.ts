import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@/lib/firebase"

const f = createUploadthing()

export const ourFileRouter = {
    propertyImage: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
        .middleware(async () => {
            console.log("auth",auth)

            if (!auth) throw new Error("Unauthorized")

            return { userId: auth?.currentUser?.uid }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId)
            console.log("file url", file.url)

            return { uploadedBy: metadata.userId, url: file.url }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

