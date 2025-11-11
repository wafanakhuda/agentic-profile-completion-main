"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const emailData = [
  { day: "Mon", sent: 12, opened: 8, clicked: 4 },
  { day: "Tue", sent: 18, opened: 14, clicked: 7 },
  { day: "Wed", sent: 15, opened: 11, clicked: 5 },
  { day: "Thu", sent: 22, opened: 17, clicked: 10 },
  { day: "Fri", sent: 19, opened: 14, clicked: 8 },
  { day: "Sat", sent: 8, opened: 5, clicked: 2 },
  { day: "Sun", sent: 5, opened: 3, clicked: 1 },
]

export default function EmailSenderMetrics() {
  const totalSent = emailData.reduce((sum, item) => sum + item.sent, 0)
  const totalOpened = emailData.reduce((sum, item) => sum + item.opened, 0)
  const openRate = ((totalOpened / totalSent) * 100).toFixed(1)

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 mb-1">Email Campaign Performance</h3>
          <p className="text-sm text-slate-400">This week's nudging emails</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-400">{totalSent}</div>
            <div className="text-xs text-slate-400">Emails Sent</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-cyan-400">{openRate}%</div>
            <div className="text-xs text-slate-400">Open Rate</div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={emailData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                labelStyle={{ color: "#e5e7eb" }}
              />
              <Legend />
              <Bar dataKey="sent" stackId="a" fill="#a855f7" />
              <Bar dataKey="opened" stackId="a" fill="#06b6d4" />
              <Bar dataKey="clicked" stackId="a" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
