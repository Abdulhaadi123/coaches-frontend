"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      toast.success(message)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.login(email, password)

      if (response.user) {
        toast.success("Login successful!")
        // Redirect based on role
        if (response.user.role === 'admin') {
          router.replace('/admin/company-management')
        } else {
          router.replace('/pricing')
        }
      } else {
        toast.error(response.message || "Invalid credentials")
      }
    } catch (err: any) {
      // Handle rate limiting error
      if (err?.message?.includes('Too many')) {
        toast.error("Too many login attempts. Please try again after 15 minutes.", {
          duration: 5000,
        })
      } else {
        toast.error("Login failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="">
              <img
                src="/images/ws-only.png"
                alt="Woodward Strategies"
                className="h-8 w-auto"
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">Wood Ward</span>
          </Link>
        </div>

        <Card
          className="border-gray-200 shadow-lg"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E5E7EB",
          }}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Log in to continue your training and track progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300 text-gray-900"
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: "#111827",
                    borderColor: "#D1D5DB",
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-300 text-gray-900"
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: "#111827",
                    borderColor: "#D1D5DB",
                  }}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-white hover:opacity-90 active:opacity-80 focus:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: "#1E63F3",
                  color: "#FFFFFF",
                }}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Link href="/forgot-password" className="text-sm text-[#1E63F3] hover:underline">
              Forgot Password?
            </Link>
            <p className="text-sm text-gray-600 text-center">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#1E63F3] hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
