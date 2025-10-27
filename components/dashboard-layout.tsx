"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import PublicationCard from "./publication-card"
import CreatePostModal from "./create-post-modal"
import VerificationModal from "./verification-modal"
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

interface Publication {
  post_id: string
  title: string
  content: string
  issuance_date: string
  vc_proof: {
    credential_id: string
    content_hash: string
  }
  proof: {
    is_verified_issuer: boolean
    content_integrity: boolean
    sentiment: string
    checked_at: string
    notes: string
  }
}

interface VerificationData {
  credential_id: string
  content_hash: string
  is_verified_issuer: boolean
  content_integrity: boolean
  checked_at: string
  notes: string
}

export default function DashboardLayout({ ministryData }: { ministryData: MinistryData | null }) {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const fetchPublications = async () => {
    const token = localStorage.getItem("access_token")

    if (!token) {
      router.push("/")
      return
    }

    try {
      const response = await fetch("https://api.dholakpur.fun/vc/post/list", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch publications")
      }

      const data = await response.json()
      setPublications(data.posts || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load publications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublications()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    router.push("/")
  }

  const handleVerify = (publication: Publication) => {
    setVerificationData({
      credential_id: publication.vc_proof.credential_id,
      content_hash: publication.vc_proof.content_hash,
      is_verified_issuer: publication.proof.is_verified_issuer,
      content_integrity: publication.proof.content_integrity,
      checked_at: publication.proof.checked_at,
      notes: publication.proof.notes,
    })
    setShowVerificationModal(true)
  }

  const handlePostCreated = () => {
    setShowCreateModal(false)
    fetchPublications()
    toast({
      title: "Success",
      description: "Publication verified and sealed by DOVI 🔏",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">✓</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">DOVI</h1>
              <p className="text-xs text-gray-500">{ministryData?.org_name}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          >
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Issued Government Publications</h2>
              <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                + Create New Publication
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full animate-spin mb-4">
                  <span className="text-white">✓</span>
                </div>
                <p className="text-gray-600">Loading publications...</p>
              </div>
            ) : publications.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No publications yet. Create your first one!</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {publications.map((pub) => (
                  <PublicationCard key={pub.post_id} publication={pub} onVerify={() => handleVerify(pub)} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌀</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ministry Profile</h3>

                <div className="space-y-3 text-sm text-left">
                  <div>
                    <p className="text-gray-600 font-semibold text-xs uppercase">Organization</p>
                    <p className="text-gray-900 font-semibold">{ministryData?.org_name}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-semibold text-xs uppercase">Username</p>
                    <p className="text-gray-900 font-mono text-xs">{ministryData?.username}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-semibold text-xs uppercase">Email</p>
                    <p className="text-gray-900 font-mono text-xs break-all">{ministryData?.email}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-semibold text-xs uppercase">Phone</p>
                    <p className="text-gray-900 font-mono text-xs">{ministryData?.phone_number}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-semibold text-xs uppercase">Address</p>
                    <p className="text-gray-900 text-xs">{ministryData?.address}</p>
                  </div>

                  <div className="pt-2 border-t border-blue-200">
                    <p className="text-gray-600 font-semibold text-xs uppercase">DID</p>
                    <p className="text-gray-900 font-mono text-xs break-all">{ministryData?.did_url}</p>
                  </div>

                  <div className="pt-3 border-t border-blue-200">
                    <p className="text-gray-700 italic text-xs">Empowering Dholakpur with Verifiable Trust</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handlePostCreated}
      />

      {verificationData && (
        <VerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          data={verificationData}
        />
      )}
    </div>
  )
}
