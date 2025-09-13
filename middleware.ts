import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log("[v0] Middleware checking path:", pathname)

  // Allow access to login page and API routes
  if (pathname === "/login" || pathname.startsWith("/api/")) {
    console.log("[v0] Allowing access to:", pathname)
    return NextResponse.next()
  }

  const authCookie = request.cookies.get("auth-token")
  const token = authCookie?.value

  console.log("[v0] Cookie found:", !!authCookie)
  console.log("[v0] Token exists:", !!token)
  console.log("[v0] Token length:", token?.length || 0)

  if (!token) {
    console.log("[v0] No token found, redirecting to login")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    console.log("[v0] Attempting to verify token...")
    const user = await verifyToken(token)

    if (!user) {
      console.log("[v0] Token verification failed - invalid token")
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("auth-token")
      return response
    }

    console.log("[v0] Token verified successfully for user:", user.email)
    return NextResponse.next()
  } catch (error) {
    console.log("[v0] Token verification error:", error)
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("auth-token")
    return response
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
