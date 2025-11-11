import { NextResponse } from "next/server"

// In-memory storage for results (in production, use a database)
let resultsCache = {
  students: [] as any[],
  lastUpdated: Date.now(),
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    resultsCache = {
      students: data.students || [],
      lastUpdated: Date.now(),
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json(resultsCache)
}
