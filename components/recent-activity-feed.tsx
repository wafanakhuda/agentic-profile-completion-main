"use client"

import { Card } from "@/components/ui/card"

const activities = [
  { time: "2 min ago", type: "email", text: "Email sent to 15 students", icon: "📧" },
  { time: "5 min ago", type: "profile", text: "3 students completed profiles", icon: "✓" },
  { time: "12 min ago", type: "nudge", text: "Nudging campaign started", icon: "📢" },
  { time: "18 min ago", type: "upload", text: "Excel file processed", icon: "📁" },
  { time: "1 hour ago", type: "email", text: "Email opened by 8 students", icon: "👁" },
]

export default function RecentActivityFeed() {
  return (
    <Card className="bg-slate-800/50 border-slate-700 p-6">
      <h3 className="text-lg font-bold text-slate-100 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-700 last:border-0">
            <div className="text-xl">{activity.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-300">{activity.text}</p>
              <p className="text-xs text-slate-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
