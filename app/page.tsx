"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard-header"
import AgentActivityView from "@/components/agent-activity-view"
import StudentResultsGrid from "@/components/student-results-grid"
import AnalyticsPanel from "@/components/analytics-panel"
import AgentStatusPanel from "@/components/agent-status-panel"
import NudgingAnalytics from "@/components/nudging-analytics"
import FileUploadModal from "@/components/file-upload-modal"
import { StudentDataTable } from "@/components/student-data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [activeTab, setActiveTab] = useState("google-sheets")

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader
        onUpload={() => setShowUploadModal(true)}
        onStart={() => {}}
        uploadedFile={uploadedFile}
        isRunning={isRunning}
      />

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Data Source Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="google-sheets">
              📊 Google Sheets (Live)
            </TabsTrigger>
            <TabsTrigger value="upload">
              📁 Upload Excel
            </TabsTrigger>
          </TabsList>

          {/* Google Sheets Tab */}
          <TabsContent value="google-sheets" className="space-y-8">
            {/* Student Data Table with Yellow Highlights */}
            <StudentDataTable />

            {/* Agent Activity */}
            <AgentActivityView 
              uploadedFile={null} 
              isRunning={isRunning} 
              onRunningChange={setIsRunning}
              useGoogleSheets={true}
            />

            <AgentStatusPanel />
            <AnalyticsPanel />
            <NudgingAnalytics />
            <StudentResultsGrid />
          </TabsContent>

          {/* Upload Excel Tab */}
          <TabsContent value="upload" className="space-y-8">
            <AgentActivityView 
              uploadedFile={uploadedFile} 
              isRunning={isRunning} 
              onRunningChange={setIsRunning}
              useGoogleSheets={false}
            />

            <AgentStatusPanel />
            <AnalyticsPanel />
            <NudgingAnalytics />
            <StudentResultsGrid />
          </TabsContent>
        </Tabs>
      </div>

      {showUploadModal && (
        <FileUploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={(filename) => {
            setUploadedFile(filename)
            setShowUploadModal(false)
            setActiveTab("upload")
          }}
        />
      )}
    </main>
  )
}