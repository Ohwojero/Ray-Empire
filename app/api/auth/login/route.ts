import { type NextRequest, NextResponse } from "next/server"
import { createToken } from "@/lib/auth"

// Mock user data - replace with your actual authentication logic
const MOCK_USER = {
  id: "1",
  email: "admin@rayempire.com",
  name: "Ray Empire Admin",
  password: "rayempire2024", // New password
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Login API received:", { email, password })

    // Validate credentials (replace with your actual validation)
    if (email !== MOCK_USER.email || password !== MOCK_USER.password) {
      console.log("[v0] Invalid credentials")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create JWT token
    const user = {
      id: MOCK_USER.id,
      email: MOCK_USER.email,
      name: MOCK_USER.name,
    }

    const token = await createToken(user)
    console.log("[v0] Token created successfully")

    const response = NextResponse.json({ success: true, user })

    // Set cookie with explicit configuration for development
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: false, // Allow HTTP in development
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    console.log("[v0] Login successful, cookie set")
    return response
  } catch (error) {
    console.log("[v0] Login API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
