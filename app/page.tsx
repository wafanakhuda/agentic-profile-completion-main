"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard-header"
import AgentActivityView from "@/components/agent-activity-view"
import StudentResultsGrid from "@/components/student-results-grid"
import AnalyticsPanel from "@/components/analytics-panel"
import AgentStatusPanel from "@/components/agent-status-panel"
import NudgingAnalytics from "@/components/nudging-analytics"
import FileUploadModal from "@/components/file-upload-modal"

export default function Dashboard() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader
        onUpload={() => setShowUploadModal(true)}
        onStart={() => {}}
        uploadedFile={uploadedFile}
        isRunning={isRunning}
      />

      <div className="container mx-auto px-6 py-8 space-y-8">
        <AgentActivityView uploadedFile={uploadedFile} isRunning={isRunning} onRunningChange={setIsRunning} />

        <AgentStatusPanel />

        <AnalyticsPanel />

        <NudgingAnalytics />

        <StudentResultsGrid />
      </div>

      {showUploadModal && (
        <FileUploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={(filename) => {
            setUploadedFile(filename)
            setShowUploadModal(false)
          }}
        />
      )}
    </main>
  )
}
