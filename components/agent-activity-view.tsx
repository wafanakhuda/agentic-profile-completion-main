"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AgentReasoningStream from "./agent-reasoning-stream"
import { TrendingUp, Play, Square } from "lucide-react"

interface Activity {
  type: "status" | "reasoning" | "decision" | "tool" | "error" | "email"
  content: string
  timestamp: number
}

interface AgentActivityViewProps {
  uploadedFile: string | null
  isRunning: boolean
  onRunningChange: (running: boolean) => void
  useGoogleSheets?: boolean  // ✅ NEW: Support Google Sheets mode
}

export default function AgentActivityView({ 
  uploadedFile, 
  isRunning, 
  onRunningChange,
  useGoogleSheets = false  // ✅ NEW: Default to false
}: AgentActivityViewProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [currentStudent, setCurrentStudent] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [elapsedTime, setElapsedTime] = useState("0:00")
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    let timerInterval: NodeJS.Timeout

    if (isRunning && startTimeRef.current) {
      timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000)
        const minutes = Math.floor(elapsed / 60)
        const seconds = elapsed % 60
        setElapsedTime(`${minutes}:${seconds.toString().padStart(2, "0")}`)
      }, 1000)
    }

    return () => clearInterval(timerInterval)
  }, [isRunning])

  const handleStartAgent = async () => {
    // ✅ UPDATED: Check if either file is uploaded OR Google Sheets mode is active
    if (!uploadedFile && !useGoogleSheets) {
      setActivities([{
        type: "error",
        content: "Please upload a file or connect Google Sheets first",
        timestamp: Date.now()
      }])
      return
    }

    setActivities([])
    setCurrentStudent(0)
    setElapsedTime("0:00")
    startTimeRef.current = Date.now()
    onRunningChange(true)

    try {
      // ✅ UPDATED: Send different payload based on mode
      const payload = useGoogleSheets 
        ? { mode: 'google-sheets' }
        : { file: uploadedFile }

      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to start agent")
      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === "start") {
                setTotalStudents(data.total || 10)
              } else if (data.type === "student") {
                setCurrentStudent(data.index || 0)
              } else if (data.content) {
                setActivities((prev) => [
                  ...prev,
                  {
                    type: data.type || "status",
                    content: data.content,
                    timestamp: Date.now(),
                  },
                ])
              }

              // ✅ NEW: Handle completion message
              if (line.includes("[DONE]")) {
                break
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Agent error:", error)
      setActivities((prev) => [
        ...prev,
        {
          type: "error",
          content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          timestamp: Date.now(),
        },
      ])
    } finally {
      onRunningChange(false)
    }
  }

  // ✅ REMOVED: Auto-start effect (now manual only)

  const progress = totalStudents > 0 ? (currentStudent / totalStudents) * 100 : 0
  const rate =
    elapsedTime !== "0:00"
      ? (
          currentStudent /
          Math.max(Number.parseInt(elapsedTime.split(":")[0]) * 60 + Number.parseInt(elapsedTime.split(":")[1]), 1)
        ).toFixed(1)
      : "0"

  // ✅ NEW: Determine if agent can start
  const canStart = useGoogleSheets || uploadedFile

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg overflow-hidden">
      <CardHeader className="pb-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border border-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-lg">
                {useGoogleSheets ? "📊 Google Sheets Processing" : "📁 File Processing"}
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Live agent reasoning and decision-making
              {useGoogleSheets && " • Connected to Google Sheets"}
            </CardDescription>
          </div>

          {/* ✅ NEW: Start/Stop Button */}
          <div className="flex items-center gap-2">
            {!isRunning ? (
              <Button
                onClick={handleStartAgent}
                disabled={!canStart}
                className="gap-2"
                size="sm"
              >
                <Play className="h-4 w-4" />
                Start Agent
              </Button>
            ) : (
              <Button
                onClick={() => onRunningChange(false)}
                variant="destructive"
                className="gap-2"
                size="sm"
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-colors">
            <div className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Current</div>
            <div className="text-3xl font-bold text-primary">{currentStudent}</div>
            <div className="text-xs text-muted-foreground mt-1.5">of {totalStudents} students</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 hover:border-secondary/40 transition-colors">
            <div className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Progress</div>
            <div className="text-3xl font-bold text-secondary">{Math.round(progress)}%</div>
            <div className="text-xs text-muted-foreground mt-1.5">completed</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-colors">
            <div className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Elapsed</div>
            <div className="text-3xl font-mono font-bold text-accent">{elapsedTime}</div>
            <div className="text-xs text-muted-foreground mt-1.5">runtime</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-chart-3/10 to-chart-3/5 border border-chart-3/20 hover:border-chart-3/40 transition-colors">
            <div className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Rate</div>
            <div className="text-3xl font-bold text-chart-3">{rate}</div>
            <div className="text-xs text-muted-foreground mt-1.5">per second</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Overall Progress</span>
            <span className="text-xs font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted/40 rounded-full h-3 overflow-hidden border border-border/50">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-primary via-accent to-secondary shadow-lg shadow-primary/30 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Activity stream */}
        <div className="border border-border/50 rounded-xl bg-muted/20 backdrop-blur-sm p-4 max-h-80 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-primary/30">
          {activities.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-12 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse" />
              </div>
              <span>
                {isRunning 
                  ? "Initializing agent..." 
                  : canStart 
                    ? "Click 'Start Agent' to begin processing"
                    : useGoogleSheets 
                      ? "Waiting for Google Sheets connection..."
                      : "Upload a file to begin"
                }
              </span>
            </div>
          ) : (
            <AgentReasoningStream activities={activities} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}