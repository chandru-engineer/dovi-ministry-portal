"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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

export default function PublicationCard({
  publication,
  onVerify,
}: {
  publication: Publication
  onVerify: () => void
}) {
  const truncateText = (text: string | undefined | null, maxLength = 150) => {
    if (!text) return "No content available"
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const truncateVcId = (vcId: string | undefined | null) => {
    if (!vcId) return "N/A"
    return vcId.substring(0, 12) + "..."
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow border-blue-100">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{publication.title || "Untitled"}</h3>
          <p className="text-gray-600 text-sm">{truncateText(publication.content)}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Issued Date</p>
            <p className="text-sm font-semibold text-gray-900">{formatDate(publication.issuance_date)}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-xs text-gray-500">VC ID</p>
            <p className="text-xs font-mono text-gray-900">{truncateVcId(publication.vc_proof.credential_id)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${publication.proof.is_verified_issuer ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span className="text-xs text-gray-600">
              {publication.proof.is_verified_issuer ? "Verified Issuer" : "Unverified"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${publication.proof.content_integrity ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span className="text-xs text-gray-600">
              {publication.proof.content_integrity ? "Integrity OK" : "Integrity Failed"}
            </span>
          </div>
        </div>

        <Button onClick={onVerify} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          DOVI Verify
        </Button>
      </div>
    </Card>
  )
}
