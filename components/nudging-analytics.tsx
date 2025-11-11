"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts"

export default function NudgingAnalytics() {
  const nudgingData = [
    { time: "09:00", sent: 12, opened: 8, clicked: 3, scheduled: 2 },
    { time: "10:00", sent: 18, opened: 14, clicked: 5, scheduled: 3 },
    { time: "11:00", sent: 25, opened: 19, clicked: 8, scheduled: 4 },
    { time: "12:00", sent: 32, opened: 24, clicked: 10, scheduled: 5 },
    { time: "13:00", sent: 28, opened: 21, clicked: 9, scheduled: 4 },
    { time: "14:00", sent: 35, opened: 26, clicked: 12, scheduled: 6 },
  ]

  const channelData = [
    { channel: "Email", count: 85, rate: 68 },
    { channel: "SMS", count: 42, rate: 52 },
    { channel: "Push", count: 58, rate: 71 },
    { channel: "In-App", count: 72, rate: 45 },
  ]

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      <Card className="border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/30">
          <CardTitle className="text-lg">Nudging Performance</CardTitle>
          <CardDescription className="text-xs">Engagement metrics over time</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={nudgingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--color-chart-1))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--color-chart-1))" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--color-chart-2))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--color-chart-2))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
                cursor={{ stroke: "var(--color-primary)", strokeWidth: 2 }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
              <Area type="monotone" dataKey="sent" stroke="hsl(var(--color-chart-1))" fill="url(#colorSent)" />
              <Area type="monotone" dataKey="opened" stroke="hsl(var(--color-chart-2))" fill="url(#colorOpened)" />
              <Line type="monotone" dataKey="clicked" stroke="hsl(var(--color-chart-3))" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/30">
          <CardTitle className="text-lg">Channel Performance</CardTitle>
          <CardDescription className="text-xs">Engagement rates by channel</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={channelData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="channel" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
              <Bar dataKey="count" fill="hsl(var(--color-chart-1))" name="Messages Sent" radius={[8, 8, 0, 0]} />
              <Bar dataKey="rate" fill="hsl(var(--color-chart-2))" name="Engagement %" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
