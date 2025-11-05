"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Brain, Coins, FileCheck, Hash, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

interface IssuanceProgressModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const steps = [
  { icon: FileCheck, label: "Post saved successfully", color: "text-accent" },
  { icon: Brain, label: "AI learning completed", color: "text-accent" },
  { icon: Coins, label: "Tokenization completed", color: "text-accent" },
  { icon: Shield, label: "VC issuance completed", color: "text-accent" },
  { icon: Hash, label: "Hash integrity validated", color: "text-accent" },
]

export function IssuanceProgressModal({ open, onOpenChange }: IssuanceProgressModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (open) {
      setCurrentStep(0)
      setIsComplete(false)

      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1
          } else {
            clearInterval(interval)
            setTimeout(() => setIsComplete(true), 500)
            return prev
          }
        })
      }, 800)

      return () => clearInterval(interval)
    }
  }, [open])

  const handleViewPosts = () => {
    onOpenChange(false)
    // Trigger refresh of posts list
    window.dispatchEvent(new Event("refreshPosts"))
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {isComplete ? "Issuance Successful" : "Processing Issuance"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Progress value={progress} className="h-2" />

          <div className="space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index <= currentStep
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    isActive ? "bg-accent/10" : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? "bg-accent/20" : "bg-muted"
                    }`}
                  >
                    {isActive ? (
                      <CheckCircle2 className={`w-5 h-5 ${step.color}`} />
                    ) : (
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <span className={`font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>

          {isComplete && (
            <div className="space-y-4 pt-4 border-t">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-accent" />
                </div>
                <p className="text-lg font-semibold text-accent">Issuance Successful</p>
                <p className="text-sm text-muted-foreground">Post is now publicly verifiable</p>
              </div>
              <Button onClick={handleViewPosts} className="w-full" size="lg">
                View Issued Posts
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
