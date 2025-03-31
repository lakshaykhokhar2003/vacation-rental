"use client"

import {useState} from "react"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Heart, LogIn, LogOut, Menu, PlusCircle, User, X} from "lucide-react"
import {useMediaQuery} from "react-responsive";
import {useAuth} from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {deleteCookie} from "cookies-next";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMediaQuery({maxWidth: 768})
  const { user, logOut } = useAuth()

  const handleLogout = () => {
    logOut()
    deleteCookie('auth')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">StayHere</span>
        </Link>

        {!isMobile && (
          <nav className="hidden md:flex md:items-center md:gap-6">
            <Link href="/properties" className="text-sm font-medium hover:text-primary">
              All Properties
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary">
              Destinations
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary">
              Experiences
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary">
              About Us
            </Link>
          </nav>
        )}

        {/* Desktop Actions */}
        {!isMobile && (
          <div className="hidden items-center gap-4 md:flex">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>


            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    <span>Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/properties/new">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>Add Property</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="absolute top-16 left-0 z-50 w-full bg-white shadow-lg">
          <nav className="container mx-auto flex flex-col px-4 py-4">
            <Link
              href="#"
              className="border-b py-3 text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Rentals
            </Link>
            <Link
              href="#"
              className="border-b py-3 text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Destinations
            </Link>
            <Link
              href="#"
              className="border-b py-3 text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Experiences
            </Link>
            <Link
              href="#"
              className="border-b py-3 text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <div className="mt-4 flex items-center gap-4">
              {user ? (
                <>
                  <Button variant="outline" className="w-full gap-2" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link href="/dashboard">
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="w-full gap-2" asChild onClick={() => setIsMenuOpen(false)}>
                  <Link href="/login">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

