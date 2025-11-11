"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function EnvironmentStatus() {
  const [envStatus, setEnvStatus] = useState(null)

  useEffect(() => {
    fetch("/api/env-status")
      .then((r) => r.json())
      .then(setEnvStatus)
      .catch(console.error)
  }, [])

  if (!envStatus) return null

  const { configured, missing, optional } = envStatus

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Required */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {configured.length >= 3 ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-sm font-semibold text-slate-200">Required ({configured.length}/3)</span>
          </div>
          <div className="text-xs text-slate-400 space-y-1">
            {["ANTHROPIC_API_KEY", "SENDGRID_API_KEY", "GOOGLE_FORM_URL"].map((key) => (
              <div key={key} className={configured.includes(key) ? "text-green-400" : "text-red-400"}>
                {configured.includes(key) ? "✓" : "✗"} {key}
              </div>
            ))}
          </div>
        </div>

        {/* Optional */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-slate-200">Optional ({optional.length})</span>
          </div>
          <div className="text-xs text-slate-400 space-y-1">
            {optional.slice(0, 3).map((key) => (
              <div key={key}>• {key}</div>
            ))}
          </div>
        </div>

        {/* Missing */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-slate-200">Missing: {missing.length}</span>
          </div>
          <div className="text-xs text-amber-400">
            {missing.length > 0 ? (
              <div>Configure in Vercel → Settings → Environment Variables</div>
            ) : (
              <div className="text-green-400">All required vars configured ✓</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
