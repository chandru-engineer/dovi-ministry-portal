"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("https://api.dholakpur.fun/users/login/ministry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      localStorage.setItem("access_token", data.access)

      toast({
        title: "Success",
        description: "Welcome to Dholakpur Ministry Portal!",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Unauthorized — your Dholakpur badge expired 🪪",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-blue-200">
        <div className="p-8">
          {/* DOVI Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 animate-pulse">
              <span className="text-2xl font-bold text-white">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">DOVI</h1>
            <p className="text-sm text-blue-600">Dholakpur Verifiable Intelligence</p>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Ministry of Dholakpur</h2>
          <p className="text-center text-sm text-gray-600 mb-8">Secure Login</p>

          {/* Subtitle */}
          <p className="text-center text-xs text-gray-500 mb-6 italic">
            Powered by DOVI — where even Bheem can't fake your document 🍬
          </p>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-blue-200 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-blue-200 focus:border-blue-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
            >
              {loading ? "Verifying..." : "Login to Portal"}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 font-semibold mb-1">Demo Credentials:</p>
            <p className="text-xs text-gray-600">
              Username: <span className="font-mono">min1</span>
            </p>
            <p className="text-xs text-gray-600">
              Password: <span className="font-mono">Pass123</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
