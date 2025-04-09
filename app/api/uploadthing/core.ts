import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@/lib/firebase"

const f = createUploadthing()

export const ourFileRouter = {
    propertyImage: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
        .middleware(async () => {

            if (!auth) throw new Error("Unauthorized")

            return { userId: auth?.currentUser?.uid }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return { uploadedBy: metadata.userId, url: file.ufsUrl }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

