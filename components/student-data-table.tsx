"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface StudentData {
  student_name: string
  roll_number: string
  email: string
  institute_name: string
  enrolled_program: string
  stream: string
  date_of_birth: string
  gender: string
  previous_education: string
  primary_language: string
  nationality: string
  completion_percentage: number
  missing_fields: string[]
}

export function StudentDataTable() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/fetch-students")
      const data = await response.json()
      
      if (data.success) {
        setStudents(data.students || [])
      } else {
        setError(data.error || "Failed to fetch data")
      }
    } catch (error) {
      setError("Failed to connect to Google Sheets. Check your configuration.")
      console.error("Error fetching students:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const exportToExcel = async () => {
    try {
      const response = await fetch("/api/export-excel")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `student_data_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting:", error)
    }
  }

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-800 border-green-200"
    if (percentage >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const isMissing = (fieldName: string, student: StudentData) => {
    return student.missing_fields?.includes(fieldName)
  }

  const fieldNames = [
    { key: "student_name", label: "Student Name" },
    { key: "roll_number", label: "Roll Number" },
    { key: "email", label: "Email" },
    { key: "institute_name", label: "Institute" },
    { key: "enrolled_program", label: "Program" },
    { key: "stream", label: "Stream" },
    { key: "date_of_birth", label: "Date of Birth" },
    { key: "gender", label: "Gender" },
    { key: "previous_education", label: "Previous Education" },
    { key: "primary_language", label: "Primary Language" },
    { key: "nationality", label: "Nationality" },
  ]

  const stats = {
    total: students.length,
    complete: students.filter(s => s.completion_percentage >= 90).length,
    incomplete: students.filter(s => s.completion_percentage < 90).length,
    critical: students.filter(s => s.completion_percentage < 70).length,
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              📊 Student Profile Data
              {!loading && students.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {students.length} Students
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Live data from Google Forms - Missing fields highlighted in yellow
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={fetchData} 
              disabled={loading} 
              variant="outline" 
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button 
              onClick={exportToExcel} 
              variant="outline" 
              size="sm"
              disabled={students.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <br />
              <span className="text-xs">
                Make sure Google Sheets API is configured and credentials.json is in place.
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Summary */}
        {students.length > 0 && (
          <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
              <div className="text-xs text-muted-foreground">Complete (≥90%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.incomplete}</div>
              <div className="text-xs text-muted-foreground">Incomplete (&lt;90%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
              <div className="text-xs text-muted-foreground">Critical (&lt;70%)</div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 sticky left-0 bg-background">#</TableHead>
                <TableHead className="w-24 sticky left-12 bg-background">Status</TableHead>
                {fieldNames.map((field) => (
                  <TableHead key={field.key} className="min-w-[150px]">
                    {field.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={fieldNames.length + 2} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <div>Loading data from Google Sheets...</div>
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={fieldNames.length + 2} className="text-center py-8">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-muted-foreground">
                      No data found. Make sure:
                      <ul className="text-xs mt-2 space-y-1">
                        <li>• Google Sheets is properly connected</li>
                        <li>• Students have filled the form</li>
                        <li>• GOOGLE_SHEET_ID is correct in .env</li>
                      </ul>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium sticky left-0 bg-background">
                      {index + 1}
                    </TableCell>
                    <TableCell className="sticky left-12 bg-background">
                      <Badge 
                        variant="outline" 
                        className={getCompletionColor(student.completion_percentage)}
                      >
                        {student.completion_percentage >= 90 ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {student.completion_percentage.toFixed(0)}%
                      </Badge>
                    </TableCell>
                    {fieldNames.map((field) => (
                      <TableCell
                        key={field.key}
                        className={
                          isMissing(field.key, student)
                            ? "bg-yellow-100 dark:bg-yellow-900/20 font-semibold border-l-2 border-yellow-400"
                            : ""
                        }
                      >
                        {isMissing(field.key, student) ? (
                          <span className="text-yellow-800 dark:text-yellow-300 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Missing
                          </span>
                        ) : (
                          <span className="text-sm">
                            {(student as any)[field.key] || "-"}
                          </span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Legend */}
        {students.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                <span>Complete (≥90%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded"></div>
                <span>Missing Field</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                <span>Critical (&lt;70%)</span>
              </div>
            </div>
            <div className="text-xs">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}