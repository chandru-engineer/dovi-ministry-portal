"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { IssuanceProgressModal } from "@/components/issuance-progress-modal"

export function PostCreationForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [titleFocused, setTitleFocused] = useState(false)
  const [contentFocused, setContentFocused] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowProgressModal(true)

    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch("https://verify-test.credissuer.com/vc/create/ministry/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      })

      const data = await response.json()

      if (response.ok) {
        // Success handled by modal
        setTitle("")
        setContent("")
      } else {
        setShowProgressModal(false)
        toast({
          title: "Issuance Failed",
          description: data.message || "Failed to create post. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setShowProgressModal(false)
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card className="shadow-2xl border-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <CardHeader className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-in fade-in duration-1000" />

          <div className="relative flex items-center gap-4 animate-in slide-in-from-left-4 duration-500">
            <div className="relative w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-500 delay-150">
              <FileText className="w-7 h-7 text-primary-foreground" />
              <div className="absolute inset-0 bg-primary/20 rounded-xl animate-pulse" />
            </div>
            <div className="flex-1 animate-in slide-in-from-right-4 duration-500 delay-100">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Create New Post
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Issue an AI-verified verifiable credential for official ministry content
              </CardDescription>
            </div>
            <Sparkles className="w-6 h-6 text-accent animate-in zoom-in-50 duration-500 delay-300" />
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-500 delay-200">
              <Label
                htmlFor="title"
                className={`text-sm font-semibold transition-colors duration-300 ${
                  titleFocused ? "text-primary" : "text-foreground"
                }`}
              >
                Title
              </Label>
              <div className="relative group">
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setTitleFocused(true)}
                  onBlur={() => setTitleFocused(false)}
                  required
                  disabled={isSubmitting}
                  className={`h-12 text-base transition-all duration-300 ${
                    titleFocused
                      ? "ring-2 ring-primary ring-offset-2 border-primary shadow-lg"
                      : "hover:border-primary/50"
                  }`}
                />
                <div
                  className={`absolute inset-0 rounded-md bg-gradient-to-r from-primary/20 to-accent/20 -z-10 blur-xl transition-opacity duration-300 ${
                    titleFocused ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-500 delay-300">
              <Label
                htmlFor="content"
                className={`text-sm font-semibold transition-colors duration-300 ${
                  contentFocused ? "text-primary" : "text-foreground"
                }`}
              >
                Content
              </Label>
              <div className="relative group">
                <Textarea
                  id="content"
                  placeholder="Enter post content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onFocus={() => setContentFocused(true)}
                  onBlur={() => setContentFocused(false)}
                  required
                  disabled={isSubmitting}
                  className={`min-h-[240px] text-base resize-none transition-all duration-300 ${
                    contentFocused
                      ? "ring-2 ring-primary ring-offset-2 border-primary shadow-lg"
                      : "hover:border-primary/50"
                  }`}
                />
                <div
                  className={`absolute inset-0 rounded-md bg-gradient-to-r from-primary/20 to-accent/20 -z-10 blur-xl transition-opacity duration-300 ${
                    contentFocused ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </div>

            <div className="animate-in slide-in-from-bottom-2 duration-500 delay-400">
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg font-semibold relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isSubmitting}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                      Submit for AI Issuance
                    </>
                  )}
                </span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <IssuanceProgressModal open={showProgressModal} onOpenChange={setShowProgressModal} />
    </>
  )
}
