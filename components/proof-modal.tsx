"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Hash, Shield, Calendar, FileText } from "lucide-react"

interface Post {
  post_id: string
  title: string
  content: string
  post_type: string
  vc_status: string
  vc_issuer_did: string
  vc_type: string
  issuance_date: string
  expiration_date: string
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

interface ProofModalProps {
  post: Post | null
  onClose: () => void
}

export function ProofModal({ post, onClose }: ProofModalProps) {
  if (!post) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <Dialog open={!!post} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Verifiable Credential Proof</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Post Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Post Information
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Title:</span>
                <p className="font-medium">{post.title}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Content:</span>
                <p className="text-sm">{post.content}</p>
              </div>
              <div className="flex gap-2 flex-wrap pt-2">
                <Badge variant="outline">Type: {post.post_type}</Badge>
                <Badge variant="outline">VC Type: {post.vc_type}</Badge>
              </div>
            </div>
          </div>

          {/* VC Proof */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Credential Details
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Credential ID:</span>
                <p className="font-mono text-sm break-all">{post.vc_proof.credential_id}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Issuer DID:</span>
                <p className="font-mono text-sm break-all">{post.vc_issuer_did}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Content Hash:</span>
                <p className="font-mono text-sm break-all flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground shrink-0" />
                  {post.vc_proof.content_hash}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              Verification Status
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Verified Issuer:</span>
                <Badge variant={post.proof.is_verified_issuer ? "default" : "destructive"} className="gap-1">
                  {post.proof.is_verified_issuer ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {post.proof.is_verified_issuer ? "Verified" : "Not Verified"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Content Integrity:</span>
                <Badge variant={post.proof.content_integrity ? "default" : "destructive"} className="gap-1">
                  {post.proof.content_integrity ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {post.proof.content_integrity ? "Intact" : "Compromised"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sentiment Analysis:</span>
                <Badge variant="outline">{post.proof.sentiment}</Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Notes:</span>
                <p className="text-sm">{post.proof.notes}</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Timeline
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issuance Date:</span>
                <span className="font-medium">{formatDate(post.issuance_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expiration Date:</span>
                <span className="font-medium">{formatDate(post.expiration_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Checked:</span>
                <span className="font-medium">{formatDate(post.proof.checked_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
