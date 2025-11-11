import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const { file } = await request.json()

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const filePath = join(process.cwd(), "public", "uploads", file)

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Create a ReadableStream that we'll use to stream agent output
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const python = spawn("python", ["profile_agent_agentic.py", "--file", filePath, "--dry-run"])

          let buffer = ""

          python.stdout.on("data", (data) => {
            buffer += data.toString()
            const lines = buffer.split("\n")
            buffer = lines.pop() || ""

            for (const line of lines) {
              if (line.trim()) {
                // Parse agent output and stream as SSE
                const content = line.trim()

                // Detect message type based on content patterns
                let type = "status"
                if (content.includes("💭") || content.includes("REASONING")) type = "reasoning"
                if (content.includes("✅") || content.includes("DECISION")) type = "decision"
                if (content.includes("🔧") || content.includes("Tool")) type = "tool"
                if (content.includes("❌") || content.includes("Error")) type = "error"

                const eventData = {
                  type,
                  content: content.replace(/^[🔧✅❌💭→]/gu, "").trim(),
                }

                controller.enqueue(`data: ${JSON.stringify(eventData)}\n\n`)
              }
            }
          })

          python.stderr.on("data", (data) => {
            const content = data.toString().trim()
            if (content) {
              controller.enqueue(`data: ${JSON.stringify({ type: "error", content })}\n\n`)
            }
          })

          python.on("close", (code) => {
            if (buffer.trim()) {
              controller.enqueue(`data: ${JSON.stringify({ type: "status", content: buffer.trim() })}\n\n`)
            }
            controller.enqueue("data: [DONE]\n\n")
            controller.close()
          })
        } catch (error) {
          controller.enqueue(`data: ${JSON.stringify({ type: "error", content: "Failed to start agent" })}\n\n`)
          controller.close()
        }
      },
    })

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Run error:", error)
    return NextResponse.json({ error: "Failed to run agent" }, { status: 500 })
  }
}
