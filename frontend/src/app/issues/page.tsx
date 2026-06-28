"use client"

import { useEffect, useState } from "react"
import { issueService, Issue } from "@/services/issue.service"
import { IssueCard } from "@/components/issues/IssueCard"
import { Loader2, AlertCircle, Inbox, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIssues = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await issueService.getIssues()
      setIssues(data)
    } catch (err: any) {
      console.error(err)
      setError("Failed to load community issues. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-border/60">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Community Issues</h1>
          <p className="text-lg text-muted-foreground mt-2">
            View, track, and support civic issues reported by fellow community members.
          </p>
        </div>
        <Link href="/report">
          <Button className="rounded-xl h-11 px-6 font-semibold flex items-center gap-2 shadow-sm hover:shadow transition-shadow">
            <Plus className="w-5 h-5" />
            <span>Report Issue</span>
          </Button>
        </Link>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        /* Loading State */
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">Loading issues...</p>
        </div>
      ) : error ? (
        /* Error State */
        <div className="max-w-md mx-auto flex flex-col items-center text-center py-16 px-6 bg-destructive/5 border border-destructive/20 rounded-2xl space-y-4">
          <div className="bg-destructive/10 p-3 rounded-full text-destructive">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-destructive">Unable to Load Issues</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button onClick={fetchIssues} variant="outline" className="rounded-xl mt-2">
            Retry Connection
          </Button>
        </div>
      ) : issues.length === 0 ? (
        /* Empty State */
        <div className="max-w-md mx-auto flex flex-col items-center text-center py-20 px-6 border border-dashed border-muted-foreground/30 rounded-2xl space-y-4 bg-muted/10">
          <div className="bg-muted p-4 rounded-full text-muted-foreground/60 shadow-inner">
            <Inbox className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">No Issues Reported Yet</h3>
            <p className="text-sm text-muted-foreground">
              Everything looks clear in your community, or no reports have been submitted.
            </p>
          </div>
          <Link href="/report">
            <Button className="rounded-xl font-semibold mt-2">
              Be the First to Report
            </Button>
          </Link>
        </div>
      ) : (
        /* Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  )
}
