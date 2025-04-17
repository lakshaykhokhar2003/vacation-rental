"use client"

import { MapPin } from "lucide-react"
import {PropertyMapProps} from "@/types";

export function PropertyMap({ location, coordinates }: PropertyMapProps) {
  return (
    <div className="space-y-4">
      <p className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <span>{location}</span>
      </p>

      {/* In a real app, this would be a Google Maps or Mapbox component */}
      <div className="relative h-[300px] w-full bg-slate-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="font-medium">{location}</p>
          <p className="text-sm text-muted-foreground">
            Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">Exact location provided after booking.</p>
    </div>
  )
}

