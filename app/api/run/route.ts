import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const { file, mode } = await request.json()

    let scriptPath: string
    let pythonArgs: string[]

    if (mode === 'google-sheets') {
      // Use Google Sheets mode
      scriptPath = join(process.cwd(), "scripts", "profile_agent_agentic.py")
      pythonArgs = [scriptPath, "--source", "google-sheets", "--dry-run"]
    } else {
      // Use uploaded file mode
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 })
      }

      const filePath = join(process.cwd(), "public", "uploads", file)
      if (!existsSync(filePath)) {
        return NextResponse.json({ error: "File not found" }, { status: 404 })
      }

      scriptPath = join(process.cwd(), "scripts", "profile_agent_agentic.py")
      pythonArgs = [scriptPath, "--file", filePath, "--dry-run"]
    }

    if (!existsSync(scriptPath)) {
      return NextResponse.json({ 
        error: "Python script not found", 
        path: scriptPath 
      }, { status: 500 })
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const python = spawn("python", pythonArgs, {
  cwd: process.cwd(),
  env: { 
    ...process.env,
    PYTHONIOENCODING: 'utf-8'  // ✅ FIX: Force UTF-8 encoding
  },
  shell: true
})

          let buffer = ""

          python.stdout.on("data", (data) => {
            buffer += data.toString()
            const lines = buffer.split("\n")
            buffer = lines.pop() || ""

            for (const line of lines) {
              if (line.trim()) {
                const content = line.trim()

                let type = "status"
                if (content.includes("💭") || content.includes("REASONING")) type = "reasoning"
                if (content.includes("✅") || content.includes("DECISION")) type = "decision"
                if (content.includes("🔧") || content.includes("Tool")) type = "tool"
                if (content.includes("📧") || content.includes("Email")) type = "email"
                if (content.includes("❌") || content.includes("Error")) type = "error"

                const eventData = {
                  type,
                  content: content.replace(/^[🔧✅❌💭📧→]/gu, "").trim(),
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

          python.on("error", (error) => {
            controller.enqueue(`data: ${JSON.stringify({ 
              type: "error", 
              content: `Failed to start Python: ${error.message}` 
            })}\n\n`)
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