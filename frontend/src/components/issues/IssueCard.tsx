import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, Tag, AlertCircle } from "lucide-react"
import { Issue } from "@/services/issue.service"
import Link from "next/link"

interface IssueCardProps {
  issue: Issue
}

export function IssueCard({ issue }: IssueCardProps) {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
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

  return (
    <Link href={`/issues/${issue.id}`} className="block h-full">
      <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow duration-200 rounded-2xl border-border/60 cursor-pointer">
      {issue.image_url ? (
        <div className="relative w-full h-48 overflow-hidden bg-muted border-b">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={issue.image_url}
            alt={issue.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-muted/40 border-b flex items-center justify-center text-muted-foreground/40">
          <AlertCircle className="w-12 h-12" />
        </div>
      )}
      <CardHeader className="p-5 pb-3 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/5 text-primary border border-primary/10 uppercase tracking-wider">
            <Tag className="w-3 h-3" />
            {issue.category || "General"}
          </span>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusClass(issue.status)}`}>
            {getStatusLabel(issue.status)}
          </span>
        </div>
        <CardTitle className="text-xl font-bold line-clamp-1 leading-snug tracking-tight">
          {issue.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0 pb-4 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {issue.description}
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0 border-t border-border/40 bg-muted/5 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 mt-4">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground/75" />
          <span>{formatDate(issue.created_at)}</span>
        </div>
      </CardFooter>
    </Card>
  </Link>
  )
}
