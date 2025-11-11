"use client"

import { Card } from "@/components/ui/card"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const completionData = [
  { range: "0-25%", count: 5, fill: "#ef4444" },
  { range: "25-50%", count: 12, fill: "#f59e0b" },
  { range: "50-75%", count: 28, fill: "#eab308" },
  { range: "75-100%", count: 35, fill: "#10b981" },
]

const fieldMissingData = [
  { name: "Email Address", missing: 2 },
  { name: "Roll Number", missing: 4 },
  { name: "Date of Birth", missing: 6 },
  { name: "Nationality", missing: 8 },
  { name: "Primary Language", missing: 12 },
]

export default function ProfileCompletionMetrics() {
  const totalIncomplete = completionData.reduce((sum, item) => sum + item.count, 0)
  const avgCompletion = 62.5

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 mb-1">Profile Completion Status</h3>
          <p className="text-sm text-slate-400">{totalIncomplete} students with incomplete profiles</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">{avgCompletion.toFixed(1)}%</div>
            <div className="text-xs text-slate-400">Avg Completion</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-amber-400">{totalIncomplete}</div>
            <div className="text-xs text-slate-400">Incomplete Profiles</div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, count }) => `${range} (${count})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {completionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
