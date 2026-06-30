"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { issueService, Issue } from "@/services/issue.service"
import { IssueCard } from "@/components/issues/IssueCard"
import { Loader2, AlertCircle, Inbox, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const mapStatusToDb = (status: string) => {
  switch (status) {
    case "Open":
      return "Reported"
    case "In Progress":
      return "In Progress"
    case "Resolved":
      return "Resolved"
    default:
      return ""
  }
}

function IssuesList() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const urlSearch = searchParams.get("search") || ""
  const urlCategory = searchParams.get("category") || "All"
  const urlStatus = searchParams.get("status") || "All"

  const [searchInput, setSearchInput] = useState(urlSearch)
  const [category, setCategory] = useState(urlCategory)
  const [status, setStatus] = useState(urlStatus)

  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Sync state if URL search query changes (e.g. forward/back navigation)
  useEffect(() => {
    setSearchInput(urlSearch)
  }, [urlSearch])

  useEffect(() => {
    setCategory(urlCategory)
  }, [urlCategory])

  useEffect(() => {
    setStatus(urlStatus)
  }, [urlStatus])

  const fetchIssues = useCallback(async (cat: string, stat: string, searchQ: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const categoryParam = cat !== "All" ? cat : undefined
      const statusParam = stat !== "All" ? mapStatusToDb(stat) : undefined

      const data = await issueService.getFilteredIssues({
        category: categoryParam,
        status: statusParam,
      })

      const issuesList = Array.isArray(data) ? data : []

      const query = searchQ.trim().toLowerCase()
      if (query) {
        const filtered = issuesList.filter(
          (issue) =>
            issue.title.toLowerCase().includes(query) ||
            issue.description.toLowerCase().includes(query)
        )
        setIssues(filtered)
      } else {
        setIssues(issuesList)
      }
    } catch (err: any) {
      console.error(err)
      setError("Failed to load community issues. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Trigger search params fetch
  useEffect(() => {
    fetchIssues(urlCategory, urlStatus, urlSearch)
  }, [urlCategory, urlStatus, urlSearch, fetchIssues])

  // Debounce search input changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchInput !== urlSearch) {
        const params = new URLSearchParams(window.location.search)
        if (searchInput) {
          params.set("search", searchInput)
        } else {
          params.delete("search")
        }
        router.push(`/issues?${params.toString()}`)
      }
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [searchInput, urlSearch, router])

  const handleSelectCategory = (val: string) => {
    setCategory(val)
    const params = new URLSearchParams(window.location.search)
    if (val && val !== "All") {
      params.set("category", val)
    } else {
      params.delete("category")
    }
    router.push(`/issues?${params.toString()}`)
  }

  const handleSelectStatus = (val: string) => {
    setStatus(val)
    const params = new URLSearchParams(window.location.search)
    if (val && val !== "All") {
      params.set("status", val)
    } else {
      params.delete("status")
    }
    router.push(`/issues?${params.toString()}`)
  }

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

      {/* Search and Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-muted/20 p-4 rounded-2xl border border-border/40">
        <div className="flex-1">
          <Input
            placeholder="Search issues by title or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-10 rounded-xl bg-background border-border/80"
          />
        </div>
        <div className="flex gap-4 sm:flex-row flex-col md:w-auto w-full">
          <div className="flex-1 md:w-[180px]">
            <Select value={category} onValueChange={handleSelectCategory}>
              <SelectTrigger className="h-10 rounded-xl bg-background border-border/80">
                <SelectValue placeholder="Category: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Road">Road</SelectItem>
                <SelectItem value="Water">Water</SelectItem>
                <SelectItem value="Streetlight">Streetlight</SelectItem>
                <SelectItem value="Waste">Waste</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 md:w-[180px]">
            <Select value={status} onValueChange={handleSelectStatus}>
              <SelectTrigger className="h-10 rounded-xl bg-background border-border/80">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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
          <Button onClick={() => fetchIssues(category, status, searchInput)} variant="outline" className="rounded-xl mt-2">
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
            <h3 className="font-bold text-lg">No Issues Found</h3>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t find any issues matching your search or filters.
            </p>
          </div>
          <Button
            onClick={() => {
              setSearchInput("")
              setCategory("All")
              setStatus("All")
              router.push("/issues")
            }}
            variant="outline"
            className="rounded-xl mt-2 font-semibold"
          >
            Clear Filters
          </Button>
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

export default function IssuesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">Loading issues...</p>
      </div>
    }>
      <IssuesList />
    </Suspense>
  )
}
