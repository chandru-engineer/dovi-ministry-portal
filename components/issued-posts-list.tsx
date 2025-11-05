"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ProofModal } from "@/components/proof-modal"

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

export function IssuedPostsList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch("https://verify-test.credissuer.com/vc/post/list", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok && data.posts) {
        setPosts(data.posts)
      } else {
        toast({
          title: "Failed to Load Posts",
          description: data.message || "Unable to fetch issued posts.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()

    const handleRefresh = () => fetchPosts()
    window.addEventListener("refreshPosts", handleRefresh)
    return () => window.removeEventListener("refreshPosts", handleRefresh)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const toggleExpand = (postId: string) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-2xl">Issued Posts</CardTitle>
              <CardDescription>View all AI-verified credentials issued by your ministry</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No posts issued yet. Create your first post above.
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const isExpanded = expandedPosts.has(post.post_id)

                return (
                  <div
                    key={post.post_id}
                    className="border rounded-lg overflow-hidden hover:border-accent/50 transition-colors"
                  >
                    <button
                      onClick={() => toggleExpand(post.post_id)}
                      className="w-full p-4 text-left hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-lg text-balance">{post.title}</h3>
                            <Badge variant={post.vc_status === "issued" ? "default" : "secondary"} className="gap-1">
                              {post.vc_status === "issued" ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {post.vc_status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>Post ID: {post.post_id.slice(0, 8)}...</span>
                            <span>Issued: {formatDate(post.issuance_date)}</span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t bg-accent/5 p-4 space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-foreground">Full Content</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{post.content}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold mb-2 text-foreground">Post Information</h4>
                            <dl className="space-y-1 text-sm">
                              <div className="flex gap-2">
                                <dt className="text-muted-foreground min-w-24">Post ID:</dt>
                                <dd className="font-mono text-xs break-all">{post.post_id}</dd>
                              </div>
                              <div className="flex gap-2">
                                <dt className="text-muted-foreground min-w-24">Post Type:</dt>
                                <dd className="capitalize">{post.post_type}</dd>
                              </div>
                              <div className="flex gap-2">
                                <dt className="text-muted-foreground min-w-24">VC Status:</dt>
                                <dd className="capitalize">{post.vc_status}</dd>
                              </div>
                            </dl>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold mb-2 text-foreground">Credential Details</h4>
                            <dl className="space-y-1 text-sm">
                              <div className="flex gap-2">
                                <dt className="text-muted-foreground min-w-32">VC Type:</dt>
                                <dd>{post.vc_type}</dd>
                              </div>
                              <div className="flex gap-2">
                                <dt className="text-muted-foreground min-w-32">Issued:</dt>
                                <dd>{formatDate(post.issuance_date)}</dd>
                              </div>
                              <div className="flex gap-2">
                                <dt className="text-muted-foreground min-w-32">Expires:</dt>
                                <dd>{formatDate(post.expiration_date)}</dd>
                              </div>
                            </dl>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-foreground">Issuer DID</h4>
                          <p className="text-xs font-mono bg-background p-2 rounded border break-all">
                            {post.vc_issuer_did}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-foreground">Verifiable Credential Proof</h4>
                          <dl className="space-y-1 text-sm">
                            <div className="flex gap-2">
                              <dt className="text-muted-foreground min-w-32">Credential ID:</dt>
                              <dd className="font-mono text-xs break-all">{post.vc_proof.credential_id}</dd>
                            </div>
                            <div className="flex gap-2">
                              <dt className="text-muted-foreground min-w-32">Content Hash:</dt>
                              <dd className="font-mono text-xs break-all">{post.vc_proof.content_hash}</dd>
                            </div>
                          </dl>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-foreground">Verification Proof</h4>
                          <dl className="space-y-1 text-sm">
                            <div className="flex gap-2">
                              <dt className="text-muted-foreground min-w-32">Verified Issuer:</dt>
                              <dd className="flex items-center gap-1">
                                {post.proof.is_verified_issuer ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span className="text-green-600">Verified</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 text-red-600" />
                                    <span className="text-red-600">Not Verified</span>
                                  </>
                                )}
                              </dd>
                            </div>
                            <div className="flex gap-2">
                              <dt className="text-muted-foreground min-w-32">Content Integrity:</dt>
                              <dd className="flex items-center gap-1">
                                {post.proof.content_integrity ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span className="text-green-600">Intact</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 text-red-600" />
                                    <span className="text-red-600">Compromised</span>
                                  </>
                                )}
                              </dd>
                            </div>
                            <div className="flex gap-2">
                              <dt className="text-muted-foreground min-w-32">Sentiment:</dt>
                              <dd className="capitalize">{post.proof.sentiment}</dd>
                            </div>
                            <div className="flex gap-2">
                              <dt className="text-muted-foreground min-w-32">Checked At:</dt>
                              <dd>{formatDate(post.proof.checked_at)}</dd>
                            </div>
                            {post.proof.notes && (
                              <div className="flex gap-2">
                                <dt className="text-muted-foreground min-w-32">Notes:</dt>
                                <dd>{post.proof.notes}</dd>
                              </div>
                            )}
                          </dl>
                        </div>

                        <div className="pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedPost(post)
                            }}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Full Proof Details
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ProofModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  )
}
