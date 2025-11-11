"use client"

import { Button } from "@/components/ui/button"
import { Upload, Play, Zap } from "lucide-react"

interface DashboardHeaderProps {
  onUpload: () => void
  onStart: () => void
  uploadedFile: string | null
  isRunning: boolean
}

export default function DashboardHeader({ onUpload, onStart, uploadedFile, isRunning }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border/40 bg-gradient-to-r from-background via-background to-primary/5 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Agent Dashboard
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time agentic profile completion & outreach system
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onUpload}
              className="gap-2 border-border/50 hover:bg-primary/5 hover:border-primary/30 transition-all bg-transparent"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Excel</span>
            </Button>

            {uploadedFile && (
              <Button
                onClick={onStart}
                disabled={isRunning}
                className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-primary/20 transition-all"
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                    <span className="hidden sm:inline">Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span className="hidden sm:inline">Start Agent</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {uploadedFile && (
          <div className="mt-4 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              📁 <span className="font-semibold text-foreground">{uploadedFile}</span> loaded and ready
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
