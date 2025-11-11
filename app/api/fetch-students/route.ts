import { NextResponse } from "next/server"
import { spawn } from "child_process"
import { join } from "path"

export async function GET() {
  try {
    const scriptPath = join(process.cwd(), "scripts", "fetch_from_sheets.py")

    return new Promise((resolve) => {
      const python = spawn("python3", [scriptPath])
      
      let dataBuffer = ""
      let errorBuffer = ""

      python.stdout.on("data", (data) => {
        dataBuffer += data.toString()
      })

      python.stderr.on("data", (data) => {
        errorBuffer += data.toString()
      })

      python.on("close", (code) => {
        if (code !== 0) {
          resolve(
            NextResponse.json(
              { error: errorBuffer || "Failed to fetch data" },
              { status: 500 }
            )
          )
          return
        }

        try {
          const result = JSON.parse(dataBuffer)
          resolve(NextResponse.json(result))
        } catch (error) {
          resolve(
            NextResponse.json(
              { error: "Failed to parse data" },
              { status: 500 }
            )
          )
        }
      })
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    )
  }
}