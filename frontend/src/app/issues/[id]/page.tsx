"use client"

import { useEffect, useState, use, useCallback } from "react"
import { issueService, Issue } from "@/services/issue.service"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  AlertCircle,
  Tag,
  CheckCircle2,
  ThumbsUp,
  Loader2,
  Building2,
  Inbox,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [issue, setIssue] = useState<Issue | null>(null)
  const [supportCount, setSupportCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSupporting, setIsSupporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchIssueDetail = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await issueService.getIssueById(id)
      setIssue(data)
      if (data.support_count !== undefined) {
        setSupportCount(data.support_count)
      }
    } catch (err: any) {
      console.error(err)
      if (err.response && err.response.status === 404) {
        setError("Issue Not Found")
      } else {
        setError("Failed to load issue details. Please check your connection.")
      }
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchIssueDetail()
  }, [fetchIssueDetail])

  const handleSupportClick = async () => {
    if (isSupporting) return
    setIsSupporting(true)
    try {
      const res = await issueService.supportIssue(id)
      setSupportCount(res.support_count)
    } catch (err) {
      console.error(err)
      alert("Failed to support the issue. Please try again.")
    } finally {
      setIsSupporting(false)
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A"
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ")
  }

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50"
      case "in_progress":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50"
      case "resolved":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50"
      default:
        return "bg-muted text-muted-foreground border border-border"
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">Loading issue details...</p>
      </div>
    )
  }

  if (error || !issue) {
    const isNotFound = error === "Issue Not Found"
    return (
      <div className="container mx-auto py-12 px-4 max-w-lg">
        <Link href="/issues" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Issues</span>
        </Link>
        <div className="flex flex-col items-center text-center p-8 border rounded-2xl bg-muted/10 space-y-5">
          <div className={`${isNotFound ? "bg-muted text-muted-foreground" : "bg-destructive/10 text-destructive"} p-4 rounded-full shadow-inner`}>
            {isNotFound ? <Inbox className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-2xl">{isNotFound ? "Issue Not Found" : "Error Loading Issue"}</h3>
            <p className="text-sm text-muted-foreground">
              {isNotFound
                ? "The civic issue you are looking for does not exist or has been removed."
                : error || "An unexpected error occurred while loading issue details."}
            </p>
          </div>
          {!isNotFound && (
            <Button onClick={fetchIssueDetail} className="rounded-xl font-semibold">
              Retry Connection
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      {/* Navigation & Header */}
      <Link href="/issues" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Issues</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and primary details */}
        <div className="lg:col-span-2 space-y-6">
          {issue.image_url ? (
            <div className="relative w-full h-[350px] sm:h-[450px] overflow-hidden bg-muted border rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={issue.image_url}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-[250px] sm:h-[350px] bg-muted/40 border rounded-2xl flex flex-col items-center justify-center text-muted-foreground/30 space-y-2">
              <AlertCircle className="w-16 h-16" />
              <p className="text-sm font-medium text-muted-foreground/60">No image uploaded</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-semibold bg-primary/5 text-primary border border-primary/10 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" />
                {issue.category || "General"}
              </span>
              <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium capitalize ${getStatusClass(issue.status)}`}>
                {getStatusLabel(issue.status)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {issue.title}
            </h1>

            <div className="border-t border-border pt-6 mt-6">
              <h3 className="font-bold text-lg mb-3">Description</h3>
              <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {issue.description}
              </p>
            </div>

            {/* Location Section */}
            <div className="border-t border-border pt-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-bold text-lg">Location Coordinates</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div className="p-3 border rounded-xl bg-muted/10">
                  <span className="block text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Latitude</span>
                  <span className="font-mono text-sm font-semibold">{issue.latitude.toFixed(6)}</span>
                </div>
                <div className="p-3 border rounded-xl bg-muted/10">
                  <span className="block text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Longitude</span>
                  <span className="font-mono text-sm font-semibold">{issue.longitude.toFixed(6)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Support Action and Meta information */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardHeader className="p-6 border-b border-border/40">
              <CardTitle className="text-xl">Support Civic Issue</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {supportCount !== null && (
                <div className="text-center p-4 bg-muted/30 border border-border/60 rounded-xl space-y-1">
                  <span className="block text-3xl font-extrabold tracking-tight text-foreground">
                    {supportCount}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Community upvotes
                  </span>
                </div>
              )}

              <Button
                onClick={handleSupportClick}
                disabled={isSupporting}
                className="w-full h-12 text-base font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                {isSupporting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <ThumbsUp className="w-5 h-5" />
                    <span>Support This Issue</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Details Metadata Widget */}
          <Card className="rounded-2xl border-border/60 bg-muted/10 shadow-sm">
            <CardContent className="p-6 space-y-4 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-border/60 last:border-b-0">
                <span className="text-muted-foreground font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground/75" />
                  <span>Reported Date</span>
                </span>
                <span className="font-semibold text-right">
                  {formatDate(issue.created_at)}
                </span>
              </div>

              {issue.department && (
                <div className="flex items-center justify-between py-2 border-b border-border/60 last:border-b-0">
                  <span className="text-muted-foreground font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground/75" />
                    <span>Assigned Department</span>
                  </span>
                  <span className="font-semibold text-right capitalize">
                    {issue.department}
                  </span>
                </div>
              )}

              {issue.severity && (
                <div className="flex items-center justify-between py-2 border-b border-border/60 last:border-b-0">
                  <span className="text-muted-foreground font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-muted-foreground/75" />
                    <span>Estimated Severity</span>
                  </span>
                  <span className="font-semibold text-right capitalize">
                    {issue.severity}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
