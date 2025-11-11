"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle, Mail, Target } from "lucide-react"

interface AgentStatus {
  name: string
  status: "active" | "idle" | "error"
  tasksCompleted: number
  tasksTotal: number
  lastActivity: string
}

export default function AgentStatusPanel() {
  const [statuses, setStatuses] = useState<AgentStatus[]>([
    {
      name: "Profile Completion",
      status: "active",
      tasksCompleted: 45,
      tasksTotal: 100,
      lastActivity: "Processing student 45",
    },
    {
      name: "Email Sender",
      status: "active",
      tasksCompleted: 32,
      tasksTotal: 45,
      lastActivity: "Sent email to student 32",
    },
    {
      name: "Nudging Engine",
      status: "idle",
      tasksCompleted: 28,
      tasksTotal: 100,
      lastActivity: "Scheduled nudge for student 28",
    },
    {
      name: "Data Validator",
      status: "active",
      tasksCompleted: 89,
      tasksTotal: 100,
      lastActivity: "Validating student 89",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "idle":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      case "idle":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getAgentIcon = (name: string) => {
    switch (name) {
      case "Profile Completion":
        return <CheckCircle2 className="w-5 h-5" />
      case "Email Sender":
        return <Mail className="w-5 h-5" />
      case "Nudging Engine":
        return <Target className="w-5 h-5" />
      default:
        return <CheckCircle2 className="w-5 h-5" />
    }
  }

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg">
      <CardHeader className="pb-4 border-b border-border/30">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border border-primary/10">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg">Agent Status</CardTitle>
        </div>
        <CardDescription className="text-xs">Real-time health & performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {statuses.map((agent, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 hover:border-primary/30 hover:shadow-md hover:shadow-primary/10 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary border border-primary/10">
                    {getAgentIcon(agent.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground">{agent.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{agent.lastActivity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  {getStatusIcon(agent.status)}
                  <Badge className={`${getStatusColor(agent.status)} text-xs font-semibold`}>
                    {agent.status === "active" ? "Active" : agent.status === "idle" ? "Idle" : "Error"}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">Progress</span>
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">
                    {agent.tasksCompleted}/{agent.tasksTotal}
                  </span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden border border-border/50">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/40"
                    style={{ width: `${(agent.tasksCompleted / agent.tasksTotal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
