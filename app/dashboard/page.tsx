"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"

interface MinistryData {
  username: string
  email: string
  org_name: string
  did_url: string
  phone_number: string
  address: string
  user_type: string
}

export default function DashboardPage() {
  const [ministryData, setMinistryData] = useState<MinistryData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchMinistryData = async () => {
      const token = localStorage.getItem("access_token")

      if (!token) {
        router.push("/")
        return
      }

      try {
        const response = await fetch("https://api.dholakpur.fun/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch ministry data")
        }

        const data = await response.json()
        setMinistryData({
          username: data.username || "Ministry",
          email: data.email || "",
          org_name: data.profile?.org_name || "Ministry of Dholakpur",
          did_url: data.profile?.did_url || "DID-UNKNOWN",
          phone_number: data.profile?.phone_number || "",
          address: data.profile?.address || "",
          user_type: data.profile?.user_type || "MINISTRY",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load ministry data",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    fetchMinistryData()
  }, [router, toast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full animate-spin mb-4">
            <span className="text-white">✓</span>
          </div>
          <p className="text-gray-600">Loading Ministry Portal...</p>
        </div>
      </div>
    )
  }

  return <DashboardLayout ministryData={ministryData} />
}
