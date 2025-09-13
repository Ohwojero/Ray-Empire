"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("admin@rayempire.com")
  const [password, setPassword] = useState("rayempire2024")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    console.log("[v0] Login attempt with:", { email, password })

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      console.log("[v0] Login response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Login successful:", data)

        setSuccess(true)
        setError("")

        console.log("[v0] Redirecting to dashboard...")
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1000)
      } else {
        const data = await response.json()
        console.log("[v0] Login failed:", data)
        setError(data.error || "Login failed")
        setSuccess(false)
      }
    } catch (error) {
      console.log("[v0] Login error:", error)
      setError("An error occurred. Please try again.")
      setSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">RAY EMPIRE</CardTitle>
          <CardDescription>Sign in to access your inventory dashboard</CardDescription>
          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-md text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100">Default Credentials:</p>
            <p className="text-blue-700 dark:text-blue-300">Email: admin@rayempire.com</p>
            <p className="text-blue-700 dark:text-blue-300">Password: rayempire2024</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>Login successful! Redirecting to dashboard...</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading || success}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {success ? "Redirecting..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
