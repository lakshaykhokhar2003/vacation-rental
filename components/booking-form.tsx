"use client"

import {useEffect, useState} from "react"
import {motion} from "framer-motion"
import {z} from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {addDays, differenceInDays, format, isAfter, isBefore, isSameDay} from "date-fns"
import {CalendarIcon, CreditCard, Loader2, Minus, Plus} from "lucide-react"
import {useToast} from "@/hooks/use-toast"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {cn} from "@/lib/utils"
import {useAuth} from "@/contexts/auth-context"
import {useCheckAvailability, useCreateBooking} from "@/hooks/use-bookings"
import {Timestamp} from "firebase/firestore"
import {loadStripe} from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

interface Property {
  id: string
  title: string
  price: number
  guests: number
  unavailableDates?: (string | Timestamp)[]
  isAvailable: boolean
}

interface BookingFormProps {
  property: Property
}

const formSchema = z
    .object({
      checkIn: z.date({
        required_error: "Check-in date is required",
      }),
      checkOut: z.date({
        required_error: "Check-out date is required",
      }),
      guests: z.number().min(1).max(99),
      name: z.string().min(2, { message: "Name must be at least 2 characters" }),
      email: z.string().email({ message: "Please enter a valid email address" }),
      phone: z.string().optional(),
      guestNames: z.array(z.string()).optional(),
    })
    .refine((data) => data.checkOut > data.checkIn, {
      message: "Check-out date must be after check-in date",
      path: ["checkOut"],
    })

export function BookingForm({ property }: BookingFormProps) {
  const [step, setStep] = useState(1)
  const [guestNames, setGuestNames] = useState<string[]>([])
  const [isRedirectingToStripe, setIsRedirectingToStripe] = useState(false)
  const [bookedDates, _] = useState<Date[]>([])
  const { toast } = useToast()
  const { user } = useAuth()
  const alternateName = user?.email && user?.email?.slice(0, user?.email.indexOf("@"))

  const createBookingMutation = useCreateBooking()
  const checkAvailabilityMutation = useCheckAvailability()

  const today = new Date()
  const sixMonthsFromNow = addDays(today, 180)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkIn: addDays(today, 1),
      checkOut: addDays(today, 3),
      guests: 1,
      name: user?.displayName ? user.displayName : alternateName || "",
      email: user?.email || "",
      phone: "",
      guestNames: [],
    },
  })


  useEffect(() => {
    if (user) {
      form.setValue("name", user.displayName || alternateName)
      form.setValue("email", user.email || "")
    }
  }, [user, form])

  const { watch, setValue, getValues } = form
  const checkIn = watch("checkIn")
  const checkOut = watch("checkOut")
  const guestsCount = watch("guests")

  useEffect(() => {
    if (guestsCount > guestNames.length) {
      setGuestNames([...guestNames, ...Array(guestsCount - guestNames.length).fill("")])
    } else if (guestsCount < guestNames.length) {
      setGuestNames(guestNames.slice(0, guestsCount))
    }
    setValue("guestNames", guestNames)
  }, [guestsCount, guestNames, setValue])

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0
  const subtotal = property.price * nights
  const serviceFee = Math.round(subtotal * 0.12)
  const total = subtotal + serviceFee

  const checkPropertyAvailability = async () => {
    if (!checkIn || !checkOut) return


    try {
      const available = await checkAvailabilityMutation.mutateAsync({
        propertyId: property.id,
        checkIn,
        checkOut,
      })

      if (!available) {
        toast({
          title: "Not available",
          description: "Sorry, this property is not available for the selected dates.",
          variant: "destructive",
        })
      }

      return available
    } catch (error) {
      console.error("Error checking availability:", error)
      toast({
        title: "Error",
        description: "Failed to check availability. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const handleGuestNameChange = (index: number, value: string) => {
    const newGuestNames = [...guestNames]
    newGuestNames[index] = value
    setGuestNames(newGuestNames)
    setValue("guestNames", newGuestNames)
  }

  const incrementGuests = () => {
    const currentGuests = getValues("guests")
    if (currentGuests < property.guests) {
      setValue("guests", currentGuests + 1)
    }
  }

  const decrementGuests = () => {
    const currentGuests = getValues("guests")
    if (currentGuests > 1) {
      setValue("guests", currentGuests - 1)
    }
  }

  const isDateBooked = (date: Date) => {
    const isBooked = bookedDates.some((bookedDate) => isSameDay(bookedDate, date))

    const isUnavailable =
        property.unavailableDates?.some((unavailableDate) => {
          if (typeof unavailableDate === "string") {
            return isSameDay(new Date(unavailableDate), date)
          } else if (unavailableDate instanceof Timestamp) {
            return isSameDay(unavailableDate.toDate(), date)
          }
          return false
        }) || false

    return isBooked || isUnavailable || !property.isAvailable
  }

  const redirectToStripeCheckout = async (bookingId: string, values: z.infer<typeof formSchema>) => {
    try {
      setIsRedirectingToStripe(true)

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          bookingId,
          checkIn: values.checkIn.toISOString(),
          checkOut: values.checkOut.toISOString(),
          guests: values.guests,
          guestInfo: {
            name: values.name,
            email: values.email,
            phone: values.phone || "",
          },
          nights,
          subtotal,
          serviceFee,
          total,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { sessionId } = await response.json()

      const stripe = await stripePromise
      if (!stripe) throw new Error("Stripe failed to load")

      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Error redirecting to Stripe:", error)
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      })
      setIsRedirectingToStripe(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (step === 1) {
      const available = await checkPropertyAvailability()

      if (available) {
        setStep(2)
      }
      return
    }

    try {
      const bookingId = await createBookingMutation.mutateAsync({
        propertyId: property.id,
        userId: user?.uid || "guest",
        checkIn: Timestamp.fromDate(values.checkIn),
        checkOut: Timestamp.fromDate(values.checkOut),
        guests: values.guests,
        totalPrice: total,
        status: "pending",
        guestInfo: {
          name: values.name,
          email: values.email,
          phone: values.phone,
        },
        guestNames: values.guestNames || [],
      })

      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: values.email,
          bookingId: bookingId,
          propertyTitle:property.title,
          checkIn: Timestamp.fromDate(values.checkIn),
          checkOut:Timestamp.fromDate(values.checkOut),
          nights,
          total,
          guestName: values.name,
        }),})
      await redirectToStripeCheckout(bookingId, values)
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Error",
        description: "There was a problem processing your booking.",
        variant: "destructive",
      })
    }
  }

  return (
      <div>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold">${property.price}</span>
              <span className="text-muted-foreground"> / night</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{nights} nights</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {step === 1 ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <FormField
                          control={form.control}
                          name="checkIn"
                          render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Check-in</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                          variant={"outline"}
                                          className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                      >
                                        {field.value ? format(field.value, "MMM d, yyyy") : <span>Pick a date</span>}
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            isBefore(date, today) ||
                                            isAfter(date, sixMonthsFromNow) ||
                                            (checkOut && isAfter(date, checkOut)) ||
                                            isDateBooked(date)
                                        }
                                        modifiers={{
                                          booked: (date) => isDateBooked(date),
                                        }}
                                        modifiersClassNames={{
                                          booked: "line-through opacity-50 bg-red-50",
                                        }}
                                        initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="checkOut"
                          render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Check-out</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                          variant={"outline"}
                                          className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                      >
                                        {field.value ? format(field.value, "MMM d, yyyy") : <span>Pick a date</span>}
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            isBefore(date, today) ||
                                            isAfter(date, sixMonthsFromNow) ||
                                            (checkIn && isBefore(date, checkIn)) ||
                                            isDateBooked(date)
                                        }
                                        modifiers={{
                                          booked: (date) => isDateBooked(date),
                                        }}
                                        modifiersClassNames={{
                                          booked: "line-through opacity-50 bg-red-50",
                                        }}
                                        initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                          )}
                      />
                    </div>

                    <FormField
                        control={form.control}
                        name="guests"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>Guests</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={decrementGuests}
                                      disabled={field.value <= 1}
                                      className="h-10 w-10"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <div className="flex-1 text-center">
                                    <span className="text-lg font-medium">{field.value}</span>
                                  </div>
                                  <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={incrementGuests}
                                      disabled={field.value >= property.guests}
                                      className="h-10 w-10"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </FormControl>
                              <p className="text-xs text-muted-foreground mt-1">
                                This property allows up to {property.guests} guests
                              </p>
                              <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="pt-4 border-t mt-4">
                      <div className="flex justify-between mb-2">
                    <span>
                      ${property.price} x {nights} nights
                    </span>
                        <span>${subtotal}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Service fee</span>
                        <span>${serviceFee}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Total</span>
                        <span>${total}</span>
                      </div>
                    </div>
                  </motion.div>
              ) : (
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                  >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="john@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone (optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}
                    />

                    {guestsCount > 1 && (
                        <div className="space-y-3">
                          <FormLabel>Guest Names</FormLabel>
                          <p className="text-xs text-muted-foreground -mt-2">
                            Please provide the names of all guests who will be staying
                          </p>

                          {guestNames.map((name, index) => (
                              <Input
                                  key={index}
                                  placeholder={`Guest ${index + 1} name`}
                                  value={name}
                                  onChange={(e) => handleGuestNameChange(index, e.target.value)}
                              />
                          ))}
                        </div>
                    )}

                    <div className="pt-4 border-t">
                      <div className="flex justify-between mb-2">
                    <span>
                      ${property.price} x {nights} nights
                    </span>
                        <span>${subtotal}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Service fee</span>
                        <span>${serviceFee}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Total</span>
                        <span>${total}</span>
                      </div>
                    </div>
                  </motion.div>
              )}

              <Button
                  type="submit"
                  className="w-full"
                  disabled={createBookingMutation.isPending || checkAvailabilityMutation.isPending || isRedirectingToStripe}
              >
                {createBookingMutation.isPending || checkAvailabilityMutation.isPending || isRedirectingToStripe ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {checkAvailabilityMutation.isPending
                          ? "Checking availability..."
                          : isRedirectingToStripe
                              ? "Redirecting to payment..."
                              : "Processing..."}
                    </>
                ) : step === 1 ? (
                    "Check Availability"
                ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Payment
                    </>
                )}
              </Button>

              {step === 2 && (
                  <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => setStep(1)}
                      disabled={createBookingMutation.isPending || isRedirectingToStripe}
                  >
                    Back
                  </Button>
              )}
            </form>
          </Form>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          By selecting the button above, you agree to our terms and conditions.
        </p>
      </div>
  )
}

