"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUploadThing } from "@/components/image-upload-thing"
import { Loader2, Save } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useProperty } from "@/hooks/use-properties"
import { useCreateProperty, useUpdateProperty } from "@/hooks/use-properties"
import {PropertyFormProps} from "@/types";

const formSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters" }),
    description: z.string().min(20, { message: "Description must be at least 20 characters" }),
    location: z.string().min(3, { message: "Location is required" }),
    price: z.coerce.number().min(1, { message: "Price must be at least 1" }),
    beds: z.coerce.number().min(1, { message: "Must have at least 1 bed" }),
    baths: z.coerce.number().min(1, { message: "Must have at least 1 bath" }),
    guests: z.coerce.number().min(1, { message: "Must accommodate at least 1 guest" }),
    amenities: z.array(z.string()).min(1, { message: "Select at least one amenity" }),
    isAvailable: z.boolean().default(true),
    images: z.array(z.string()).min(1, { message: "Upload at least one image" }),
})

const amenitiesList = [
    { id: "wifi", label: "WiFi" },
    { id: "kitchen", label: "Kitchen" },
    { id: "parking", label: "Free Parking" },
    { id: "pool", label: "Pool" },
    { id: "hotTub", label: "Hot Tub" },
    { id: "ac", label: "Air Conditioning" },
    { id: "heating", label: "Heating" },
    { id: "washer", label: "Washer & Dryer" },
    { id: "tv", label: "TV" },
    { id: "beachAccess", label: "Beach Access" },
    { id: "mountainView", label: "Mountain View" },
    { id: "bbq", label: "BBQ Grill" },
]


export function PropertyForm({ propertyId }: PropertyFormProps) {
    const [deletedImages, setDeletedImages] = useState<string[]>([])
    const router = useRouter()
    const { toast } = useToast()
    const { user } = useAuth()

    const { data: property, isLoading: isLoadingProperty } = useProperty(propertyId || "")
    const createPropertyMutation = useCreateProperty()
    const updatePropertyMutation = useUpdateProperty()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: property?.title || "",
            description: property?.description || "",
            location: property?.location || "",
            price: property?.price || 100,
            beds: property?.beds || 1,
            baths: property?.baths || 1,
            guests: property?.guests || 2,
            amenities: property?.amenities || ["WiFi", "Kitchen"],
            isAvailable: property?.isAvailable ?? true,
            images: property?.images || [],
        },
    })

    useEffect(() => {
        if (property && !form.formState.isDirty) {
            form.reset({
                title: property.title,
                description: property.description,
                location: property.location,
                price: property.price,
                beds: property.beds,
                baths: property.baths,
                guests: property.guests,
                amenities: property.amenities,
                isAvailable: property.isAvailable,
                images: property.images,
            })
        }
    }, [property, form])


    const handleImageRemove = (url: string) => {
        setDeletedImages((prev) => [...prev, url])
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!user) {
            toast({
                title: "Authentication Error",
                description: "You must be logged in to create or edit properties",
                variant: "destructive",
            })
            return
        }


        try {
            if (propertyId && propertyId !== "new") {
                await updatePropertyMutation.mutateAsync({
                    propertyId,
                    propertyData: {
                        ...values,
                        ownerId: user.uid,
                        coordinates: property?.coordinates || { lat: 0, lng: 0 },
                    },
                    deletedImageUrls: deletedImages,
                })

                toast({
                    title: "Property Updated",
                    description: "Your property has been updated successfully",
                })

            } else {
             await createPropertyMutation.mutateAsync({
                    propertyData: {
                        ...values,
                        ownerId: user.uid,
                        coordinates: { lat: 0, lng: 0 },
                        rating: Math.random() * 1.5 + 3.5,
                        reviews: Math.floor(Math.random() * 100) + 5,
                        isSuperhost: false,
                        createdAt: null,
                        updatedAt: null,
                    },
                })

                toast({
                    title: "Property Created",
                    description: "Your property has been created successfully",
                })
            }
            router.push("/dashboard")
        } catch (error: any) {
            console.error("Error saving property:", error)
            toast({
                title: "Error",
                description: error.message || "Failed to save property",
                variant: "destructive",
            })
        }
    }

    if (isLoadingProperty) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Property Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Beachfront Villa with Ocean View" {...field} />
                                </FormControl>
                                <FormDescription>A catchy title that describes your property</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe your property in detail..." className="min-h-[150px]" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Provide a detailed description of your property, including special features and amenities
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Malibu, California" {...field} />
                                    </FormControl>
                                    <FormDescription>City, state, or region where your property is located</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price per Night ($)</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="1" {...field} />
                                    </FormControl>
                                    <FormDescription>Set a competitive price for your property</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="beds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Beds</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="baths"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bathrooms</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="guests"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Guests</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="amenities"
                        render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel>Amenities</FormLabel>
                                    <FormDescription>Select all amenities that your property offers</FormDescription>
                                </div>
                                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                                    {amenitiesList.map((amenity) => (
                                        <FormField
                                            key={amenity.id}
                                            control={form.control}
                                            name="amenities"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem key={amenity.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(amenity.label)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, amenity.label])
                                                                        : field.onChange(field.value?.filter((value) => value !== amenity.label))
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">{amenity.label}</FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isAvailable"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Available for Booking</FormLabel>
                                    <FormDescription>
                                        Uncheck this if your property is not available for booking at this time
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />

                    <div>
                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <ImageUploadThing
                                            value={field.value}
                                            onChange={(urls) => {
                                                field.onChange(urls)
                                            }}
                                            onRemove={handleImageRemove}
                                        />
                                    </FormControl>
                                    <FormDescription>Upload images of your property (maximum 10)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/dashboard")}
                            disabled={createPropertyMutation.isPending || updatePropertyMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createPropertyMutation.isPending || updatePropertyMutation.isPending}>
                            {(createPropertyMutation.isPending || updatePropertyMutation.isPending) && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <Save className="mr-2 h-4 w-4" />
                            {propertyId && propertyId !== "new" ? "Update Property" : "Create Property"}
                        </Button>
                    </div>
                </form>
            </Form>
        </motion.div>
    )
}

