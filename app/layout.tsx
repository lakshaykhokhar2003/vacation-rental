import React, {Suspense} from "react"
import "./globals.css"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import {Navbar} from "@/components/navbar"
import {Footer} from "@/components/footer"
import {AuthProvider} from "@/contexts/auth-context"
import {QueryProvider} from "@/lib/providers/query-provider"
import {Toaster} from "@/components/ui/toaster"
import {NextSSRPlugin} from "@uploadthing/react/next-ssr-plugin"
import {extractRouterConfig} from "uploadthing/server"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import {ourFileRouter} from "./api/uploadthing/core"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "StayHere - Find Your Perfect Vacation Rental",
    description: "Discover and book unique accommodations around the world",
    icons:{
        icon: "/logo.svg",
    }
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthProvider>
            <QueryProvider>
                <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)}/>
                <Suspense>
                    <div className="flex min-h-screen flex-col">
                        <Navbar/>
                        <main className="flex-1">{children}</main>
                        <Footer/>
                        <Toaster/>
                    </div>
                </Suspense>
            </QueryProvider>
        </AuthProvider>
        <Analytics/>
        <SpeedInsights/>
        </body>
        </html>
    )
}