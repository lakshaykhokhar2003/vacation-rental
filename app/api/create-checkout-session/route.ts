import { NextResponse } from "next/server"
import Stripe from "stripe"
import { auth } from "@/lib/firebase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-02-24.acacia",
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            propertyId,
            propertyTitle,
            bookingId,
            checkIn,
            checkOut,
            guests,
            guestInfo,
            nights,
            subtotal,
            serviceFee,
        } = body

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: propertyTitle,
                            description: `${nights} night stay from ${new Date(checkIn).toLocaleDateString()} to ${new Date(checkOut).toLocaleDateString()} for ${guests} guests`,
                        },
                        unit_amount: subtotal * 100,
                    },
                    quantity: 1,
                },
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Service Fee",
                            description: "Service fee for booking",
                        },
                        unit_amount: serviceFee * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/confirmation?id=${bookingId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/property/${propertyId}?canceled=true`,
            metadata: {
                bookingId,
                propertyId,
                userId: auth.currentUser?.uid || "guest",
            },
            customer_email: guestInfo.email,
        })

        return NextResponse.json({ sessionId: session.id })
    } catch (error: any) {
        console.error("Error creating checkout session:", error)
        return NextResponse.json({ error: { message: error.message || "Something went wrong" } }, { status: 500 })
    }
}

