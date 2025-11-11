import { NextResponse } from "next/server"

export async function GET() {
  const dashboardData = {
    agents: {
      profileCompletion: {
        status: "active",
        lastRun: new Date().toISOString(),
        studentsProcessed: 80,
      },
      emailSender: {
        status: "active",
        emailsSent: 52,
        openRate: 73.5,
      },
      nudging: {
        status: "active",
        nudgesSent: 120,
        completionRate: 73,
      },
    },
    metrics: {
      totalStudents: 100,
      incompleteProfiles: 20,
      avgCompletion: 62.5,
      emailsThisWeek: 99,
      conversionRate: 73,
    },
  }

  return NextResponse.json(dashboardData)
}
