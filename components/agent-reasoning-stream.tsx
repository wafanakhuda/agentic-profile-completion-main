"use client"

import { useEffect, useRef } from "react"

interface Activity {
  type: "status" | "reasoning" | "decision" | "tool" | "error"
  content: string
  timestamp: number
}

interface AgentReasoningStreamProps {
  activities: Activity[]
}

export default function AgentReasoningStream({ activities }: AgentReasoningStreamProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activities])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "reasoning":
        return "💭"
      case "decision":
        return "✅"
      case "tool":
        return "🔧"
      case "error":
        return "❌"
      default:
        return "→"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "reasoning":
        return "text-blue-600 dark:text-blue-400"
      case "decision":
        return "text-green-600 dark:text-green-400"
      case "tool":
        return "text-amber-600 dark:text-amber-400"
      case "error":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-2 font-mono text-sm">
      {activities.map((activity, idx) => (
        <div key={idx} className={`flex gap-2 ${getTypeColor(activity.type)}`}>
          <span className="flex-shrink-0">{getTypeIcon(activity.type)}</span>
          <span className="break-words flex-1 text-foreground">{activity.content}</span>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}
