"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin, Search, Users } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function SearchForm() {
  const [location, setLocation] = useState("")
  const [guests, setGuests] = useState(1)
  const [date, setDate] = useState<Date>()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", { location, guests, date })
    // Implement search functionality
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Where are you going?"
          className="pl-10"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("justify-start text-left font-normal md:w-[200px]", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>

      <div className="relative md:w-[150px]">
        <Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={guests}
          onChange={(e) => setGuests(Number.parseInt(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? "Guest" : "Guests"}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="gap-2 md:w-auto">
        <Search className="h-4 w-4" />
        <span>Search</span>
      </Button>
    </form>
  )
}

