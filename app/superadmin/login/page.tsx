"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Lock, Mail, UserPlus } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [createAdminData, setCreateAdminData] = useState({ email: "", password: "", name: "" })
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session")
        const data = await response.json()
        if (data.user) {
          router.push("/superadmin")
        }
      } catch (error) {
        // User not logged in, continue
      }
    }
    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/superadmin")
        router.refresh()
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createAdminData),
      })

      const data = await response.json()

      if (response.ok) {
        setShowCreateAdmin(false)
        setEmail(createAdminData.email)
        setError("")
        alert("Admin user created successfully! You can now log in.")
      } else {
        setError(data.error || "Failed to create admin user")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (showCreateAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create Admin User
            </CardTitle>
            <CardDescription className="text-gray-400">Set up your first admin account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={createAdminData.name}
                  onChange={(e) => setCreateAdminData({ ...createAdminData, name: e.target.value })}
                  className="bg-[#2A2A2A] border-[#3A3A3A] text-white placeholder-gray-500 focus:border-blue-500"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={createAdminData.email}
                  onChange={(e) => setCreateAdminData({ ...createAdminData, email: e.target.value })}
                  className="bg-[#2A2A2A] border-[#3A3A3A] text-white placeholder-gray-500 focus:border-blue-500"
                  placeholder="admin@portfolio.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={createAdminData.password}
                  onChange={(e) => setCreateAdminData({ ...createAdminData, password: e.target.value })}
                  className="bg-[#2A2A2A] border-[#3A3A3A] text-white placeholder-gray-500 focus:border-blue-500"
                  placeholder="Choose a strong password"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateAdmin(false)}
                  className="flex-1 border-[#3A3A3A] text-gray-300 hover:bg-[#2A2A2A]"
                >
                  Back to Login
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                >
                  {isLoading ? "Creating..." : "Create Admin"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Portfolio Admin
          </CardTitle>
          <CardDescription className="text-gray-400">Sign in to manage your portfolio content</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#2A2A2A] border-[#3A3A3A] text-white placeholder-gray-500 focus:border-blue-500"
                placeholder="admin@portfolio.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#2A2A2A] border-[#3A3A3A] text-white placeholder-gray-500 focus:border-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateAdmin(true)}
              className="w-full border-[#3A3A3A] text-gray-300 hover:bg-[#2A2A2A] flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Create First Admin User
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-400 text-sm">
              <strong>First Time Setup:</strong>
              <br />
              Click "Create First Admin User" to set up your admin account, then log in with those credentials.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
