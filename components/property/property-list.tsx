"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, MoreVertical, Trash2, Calendar, Eye } from "lucide-react"
import { useUserProperties, useDeleteProperty } from "@/hooks/use-properties"
import { useAuth } from "@/contexts/auth-context"
import {PropertyListProps} from "@/types";

export function PropertyList({
                               properties: propProperties,
                               isLoading: propIsLoading,
                               emptyMessage,
                             }: PropertyListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const { data: fetchedProperties, isLoading: isFetchingProperties } = useUserProperties(user?.uid, {
    enabled: !propProperties && !!user?.uid,
  })

  const properties = propProperties || fetchedProperties
  const isLoading = propIsLoading || isFetchingProperties

  const deletePropertyMutation = useDeleteProperty()

  const handleDelete = async (id: string) => {
    try {
      await deletePropertyMutation.mutateAsync(id)

      toast({
        title: "Property deleted",
        description: "The property has been successfully deleted",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete property",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  if (isLoading) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton className="h-[200px] w-full rounded-t-lg" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
          ))}
        </div>
    )
  }

  if (!properties || properties.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="mb-2 text-xl font-semibold">No properties yet</h3>
          <p className="mb-6 text-muted-foreground">{emptyMessage || "Add your first property to get started"}</p>
          <Button asChild>
            <Link href="/dashboard/properties/new">Add New Property</Link>
          </Button>
        </div>
    )
  }

  return (
      <>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, index) => (
              <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg">
                    <Image
                        src={property.images[0] || "/placeholder.svg"}
                        alt={property.title}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {!property.isAvailable && (
                        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 text-xs font-medium text-white rounded">
                          Not Available
                        </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1 text-lg font-semibold line-clamp-1">{property.title}</h3>
                    <p className="mb-2 text-sm text-muted-foreground">{property.location}</p>
                    <p className="font-medium">
                      ${property.price} <span className="text-sm font-normal text-muted-foreground">/ night</span>
                    </p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between p-4 pt-0">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/properties/${property.id}`}>
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/properties/${property.id}/calendar`}>
                          <Calendar className="mr-1 h-4 w-4" />
                          Availability
                        </Link>
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/property/${property.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Listing
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteId(property.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              </motion.div>
          ))}
        </div>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the property and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteId && handleDelete(deleteId)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  )
}

