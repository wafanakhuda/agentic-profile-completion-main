"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StudentResult {
  name: string
  roll: string
  completion: number
  decision: "send" | "schedule" | "skip"
  reasoning: string
  status: "processing" | "sent" | "scheduled" | "skipped"
  missingFields: string[]
}

export default function StudentResultsGrid() {
  const [results, setResults] = useState<StudentResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("/api/results")
        if (response.ok) {
          const data = await response.json()
          setResults(data.students || [])
        }
      } catch (error) {
        console.error("Failed to fetch results:", error)
      } finally {
        setLoading(false)
      }
    }

    const interval = setInterval(fetchResults, 2000)
    fetchResults()

    return () => clearInterval(interval)
  }, [])

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "skipped":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "processing":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case "send":
        return "text-green-600 dark:text-green-400"
      case "schedule":
        return "text-blue-600 dark:text-blue-400"
      case "skip":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">📋 Student Results</h3>

        {loading && results.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Waiting for agent to process students...</div>
        ) : results.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No results yet</div>
        ) : (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {results.map((student, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 space-y-3 bg-card hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{student.name}</div>
                    <div className="text-xs text-muted-foreground">{student.roll}</div>
                  </div>
                  <Badge className={getStatusBadgeColor(student.status)}>{student.status}</Badge>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">Completion</span>
                    <span className="text-sm font-semibold">{student.completion}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${student.completion}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className={`text-sm font-medium mb-1 ${getDecisionColor(student.decision)}`}>
                    Decision: <span className="uppercase">{student.decision}</span>
                  </div>
                </div>

                {student.missingFields.length > 0 && (
                  <div className="text-xs">
                    <div className="text-muted-foreground mb-1">Missing:</div>
                    <div className="flex flex-wrap gap-1">
                      {student.missingFields.map((field, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground line-clamp-3">{student.reasoning}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
