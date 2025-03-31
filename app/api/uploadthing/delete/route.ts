import { NextResponse } from "next/server"
import { UTApi } from "uploadthing/server"
import { auth } from "@/lib/firebase"

const utapi = new UTApi()

export async function POST(request: Request) {
    try {
        if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { fileKey } = await request.json()

        if (!fileKey) return NextResponse.json({ error: "File key is required" }, { status: 400 })

        await utapi.deleteFiles(fileKey)

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Error deleting file:", error)
        return NextResponse.json({ error: error.message || "Failed to delete file" }, { status: 500 })
    }
}

