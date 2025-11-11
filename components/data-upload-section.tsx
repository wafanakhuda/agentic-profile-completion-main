"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet } from "lucide-react"

export default function DataUploadSection({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files?.[0]) {
      uploadFile(files[0])
    }
  }

  const uploadFile = async (file) => {
    if (!file.name.endsWith(".xlsx")) {
      alert("Please upload an Excel (.xlsx) file")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (res.ok) {
        onUploadSuccess()
        alert("File uploaded successfully")
      }
    } catch (err) {
      alert("Upload failed: " + err.message)
    }
    setUploading(false)
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-6">
      <h3 className="text-lg font-bold text-slate-100 mb-4">Upload Student Data</h3>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          dragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-600 hover:border-slate-500"
        }`}
      >
        <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-blue-400" />
        <p className="text-sm text-slate-300 mb-2">Drag Excel file here or click to browse</p>
        <p className="text-xs text-slate-500">Supported: .xlsx files with student profiles</p>

        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
          className="hidden"
          id="file-input"
        />
      </div>

      <label htmlFor="file-input">
        <Button as="label" disabled={uploading} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Uploading..." : "Choose File"}
        </Button>
      </label>
    </Card>
  )
}
