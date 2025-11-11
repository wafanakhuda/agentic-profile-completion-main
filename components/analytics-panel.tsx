"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Users, Mail, Target } from "lucide-react"

interface Analytics {
  totalProcessed: number
  sent: number
  scheduled: number
  skipped: number
  completionDistribution: { range: string; count: number }[]
  decisionBreakdown: { name: string; value: number }[]
  totalCost: number
}

export default function AnalyticsPanel() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalProcessed: 0,
    sent: 0,
    scheduled: 0,
    skipped: 0,
    completionDistribution: [],
    decisionBreakdown: [],
    totalCost: 0,
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/results")
        if (response.ok) {
          const data = await response.json()
          const students = data.students || []

          const sent = students.filter((s: any) => s.decision === "send").length
          const scheduled = students.filter((s: any) => s.decision === "schedule").length
          const skipped = students.filter((s: any) => s.decision === "skip").length

          const ranges = [
            { range: "0-25%", count: students.filter((s: any) => s.completion <= 25).length },
            { range: "26-50%", count: students.filter((s: any) => s.completion > 25 && s.completion <= 50).length },
            { range: "51-75%", count: students.filter((s: any) => s.completion > 50 && s.completion <= 75).length },
            { range: "76-100%", count: students.filter((s: any) => s.completion > 75).length },
          ]

          setAnalytics({
            totalProcessed: students.length,
            sent,
            scheduled,
            skipped,
            completionDistribution: ranges,
            decisionBreakdown: [
              { name: "Sent", value: sent },
              { name: "Scheduled", value: scheduled },
              { name: "Skipped", value: skipped },
            ],
            totalCost: students.length * 0.015,
          })
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      }
    }

    const interval = setInterval(fetchAnalytics, 3000)
    fetchAnalytics()

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="border-0 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Emails Sent</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{analytics.sent}</p>
                <p className="text-xs text-muted-foreground mt-2">campaign outreach</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100/50 dark:bg-emerald-900/30">
                <Mail className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-500/20 to-blue-500/5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Scheduled</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{analytics.scheduled}</p>
                <p className="text-xs text-muted-foreground mt-2">future nudges</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100/50 dark:bg-blue-900/30">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-500/20 to-purple-500/5 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Processed</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{analytics.totalProcessed}</p>
                <p className="text-xs text-muted-foreground mt-2">total students</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-100/50 dark:bg-purple-900/30">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-amber-500/20 to-amber-500/5 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Cost</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  ${analytics.totalCost.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">API usage</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100/50 dark:bg-amber-900/30">
                <TrendingUp className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg">
          <CardHeader className="pb-4 border-b border-border/30">
            <CardTitle className="text-lg">Completion Distribution</CardTitle>
            <CardDescription className="text-xs">Students by profile completion percentage</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={analytics.completionDistribution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="range" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--color-chart-1))" radius={[8, 8, 0, 0]} isAnimationActive={true} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg">
          <CardHeader className="pb-4 border-b border-border/30">
            <CardTitle className="text-lg">Decision Breakdown</CardTitle>
            <CardDescription className="text-xs">Distribution of agent decisions</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={analytics.decisionBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={true}
                >
                  {["hsl(var(--color-chart-1))", "hsl(var(--color-chart-2))", "hsl(var(--color-chart-3))"].map(
                    (color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ),
                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
