import { NextResponse } from "next/server"

export async function GET() {
  const required = ["ANTHROPIC_API_KEY", "SENDGRID_API_KEY", "GOOGLE_FORM_URL"]
  const optional = [
    "EXCEL_FILE_PATH",
    "PROFILE_COMPLETION_DEADLINE",
    "FROM_EMAIL",
    "FROM_NAME",
    "SUPPORT_EMAIL",
    "GMAIL_ADDRESS",
  ]

  const configured = required.filter((key) => process.env[key])
  const configuredOptional = optional.filter((key) => process.env[key])
  const missing = required.filter((key) => !process.env[key])

  return NextResponse.json({
    configured,
    optional: configuredOptional,
    missing,
    status: missing.length === 0 ? "ready" : "incomplete",
  })
}
