"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X, ImageIcon } from "lucide-react"
import { UTUploadDropzone } from "@/lib/providers/upload-provider"
import { useToast } from "@/hooks/use-toast"
import { useUploadThing } from "@/hooks/use-upload-thing"

interface ImageUploadThingProps {
    maxImages?: number
    value?: string[]
    onChange?: (urls: string[]) => void
    onRemove?: (url: string) => void
}

export function ImageUploadThing({ maxImages = 5, value = [], onChange, onRemove }: ImageUploadThingProps) {
    const [images, setImages] = useState<string[]>(value)
    const { toast } = useToast()
    const { deleteFile } = useUploadThing()

    useEffect(() => {
        if (JSON.stringify(value) !== JSON.stringify(images)) {
            setImages(value)
        }
    }, [value])

    const handleRemoveImage = async (index: number, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const newImages = [...images]
        const removedUrl = newImages[index]

        newImages.splice(index, 1)
        setImages(newImages)

        if (onChange) onChange(newImages)


        if (onRemove) onRemove(removedUrl)


        if (removedUrl) {
            try {
                await deleteFile(removedUrl)
            } catch (error) {
                console.error("Failed to delete file from UploadThing:", error)
                toast({
                    title: "Error",
                    description: "Failed to delete image",
                    variant: "destructive"
                })
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-2">
                <Label htmlFor="images">Property Images</Label>

                {images.length < maxImages && (
                    <UTUploadDropzone
                        endpoint="propertyImage"
                        onClientUploadComplete={(res) => {
                            const newUrls = res.map((file) => file.url)

                            const updatedImages = [...images, ...newUrls]
                            setImages(updatedImages)

                            if (onChange) onChange(updatedImages)

                            toast({
                                title: "Upload complete",
                                description: `Successfully uploaded ${res.length} image${res.length === 1 ? "" : "s"}`,
                            })
                        }}
                        onUploadError={(error: Error) => {
                            console.error("UploadThing error:", error)
                            toast({
                                title: "Upload error",
                                description: error.message,
                                variant: "destructive",
                            })
                        }}
                        config={{ mode: "auto" }}
                    />
                )}

                <p className="text-xs text-muted-foreground">
                    You can upload up to {maxImages} images. Supported formats: JPG, PNG, GIF.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                <AnimatePresence>
                    {images.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="relative aspect-square rounded-md overflow-hidden border"
                        >
                            <Image
                                src={image || "/placeholder.svg"}
                                alt={`Property image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 rounded-full"
                                onClick={(e) => handleRemoveImage(index, e)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {images.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-8 border border-dashed rounded-md">
                        <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No images uploaded yet</p>
                    </div>
                )}
            </div>
        </div>
    )
}

