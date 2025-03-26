import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth")
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/dashboard") && !authCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (authCookie && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}
