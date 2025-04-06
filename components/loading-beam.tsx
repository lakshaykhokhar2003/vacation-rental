"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingBeam() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isNavigating, setIsNavigating] = useState(false)

    useEffect(() => {
        setIsNavigating(true)

        const timer = setTimeout(() => {
            setIsNavigating(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [pathname, searchParams])

    return (
        <div className="h-1 w-full overflow-hidden">
            <AnimatePresence>
                {isNavigating && (
                    <motion.div
                        className="h-full bg-gradient-to-r from-transparent via-primary to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

