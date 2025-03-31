import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import {BookingConfirmationEmail} from "@/components/EmailConformation";

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {

    try {
        const {
            bookingId,
            propertyTitle,
            checkIn,
            checkOut,
            nights,
            total,
            guestName,
            to: guestEmail,
        } = await request.json()


        const data = await resend.emails.send({
            from: 'noreply@resend.dev',
            to: guestEmail,
            subject: `Booking Confirmation #${bookingId}`,
            react: BookingConfirmationEmail({
                bookingId,
                propertyTitle,
                checkIn,
                checkOut,
                nights,
                total,
                guestName,
            }),
        });

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error })
    }
}