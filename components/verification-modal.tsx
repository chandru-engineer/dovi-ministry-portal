"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface VerificationData {
  credential_id: string
  content_hash: string
  is_verified_issuer: boolean
  content_integrity: boolean
  checked_at: string
  notes: string
}

export default function VerificationModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean
  onClose: () => void
  data: VerificationData
}) {
  if (!isOpen) return null

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="p-6">
          {/* DOVI Seal Animation */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 animate-pulse">
              <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verified by DOVI</h2>
          </div>

          {/* Verification Details */}
          <div className="space-y-4 mb-6">
            <div
              className={`p-4 rounded-lg border ${data.is_verified_issuer && data.content_integrity ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}
            >
              <p
                className={`text-sm ${data.is_verified_issuer && data.content_integrity ? "text-green-800" : "text-yellow-800"}`}
              >
                {data.is_verified_issuer && data.content_integrity ? "✓" : "⚠"} {data.notes}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                className={`p-3 rounded-lg border ${data.is_verified_issuer ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              >
                <p className="text-xs text-gray-600 font-semibold mb-1">Issuer Status</p>
                <p className={`text-sm font-bold ${data.is_verified_issuer ? "text-green-700" : "text-red-700"}`}>
                  {data.is_verified_issuer ? "✓ Verified" : "✗ Unverified"}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg border ${data.content_integrity ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              >
                <p className="text-xs text-gray-600 font-semibold mb-1">Content Integrity</p>
                <p className={`text-sm font-bold ${data.content_integrity ? "text-green-700" : "text-red-700"}`}>
                  {data.content_integrity ? "✓ Valid" : "✗ Invalid"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">🔐</span>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Credential ID</p>
                  <p className="text-xs font-mono text-gray-900 break-all">{data.credential_id}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-lg">🧩</span>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Content Hash</p>
                  <p className="text-xs font-mono text-gray-900 break-all">{data.content_hash}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-lg">🕓</span>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Verified At</p>
                  <p className="text-sm text-gray-900">{formatDate(data.checked_at)}</p>
                </div>
              </div>
            </div>
          </div>

          <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}
