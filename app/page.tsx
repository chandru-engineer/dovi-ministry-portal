"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Loader2, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("https://verify-test.credissuer.com/users/login/ministry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok && data.access) {
        localStorage.setItem("access_token", data.access)
        localStorage.setItem("refresh_token", data.refresh)
        toast({
          title: "Authentication Successful",
          description: "Redirecting to dashboard...",
        })
        setTimeout(() => {
          router.push("/dashboard")
        }, 500)
      } else {
        toast({
          title: "Authentication Failed",
          description: data.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to authentication server.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-balance">Ministry AI Credential Portal</CardTitle>
          <CardDescription className="text-base">
            Secure access for authorized government ministry users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-accent/20 border-accent">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <div className="font-semibold mb-1">Demo Credentials:</div>
              <div className="font-mono text-xs space-y-1">
                <div>
                  <span className="text-muted-foreground">Username:</span> foreign-ministry
                </div>
                <div>
                  <span className="text-muted-foreground">Password:</span> PAssword@123
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
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
                disabled={isLoading}
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Authenticating credentials…
                </>
              ) : (
                "Login Securely"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
