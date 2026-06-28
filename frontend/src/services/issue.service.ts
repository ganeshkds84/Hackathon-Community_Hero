import { api } from "@/services/api";

export interface ReportIssuePayload {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
}

export interface IssueReportResponse {
  issue_created: boolean;
  possible_duplicate: boolean;
  message: string;
  issue_id: string | null;
  existing_issue_id: string | null;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string | null;
  severity: string | null;
  status: string;
  department: string | null;
  latitude: number;
  longitude: number;
  image_url: string | null;
  created_at: string;
  support_count?: number;
}

export const issueService = {
  /**
   * Submits a civic issue report to the backend.
   * @param payload The issue details payload.
   * @returns The API response.
   */
  async reportIssue(payload: ReportIssuePayload): Promise<IssueReportResponse> {
    const response = await api.post<IssueReportResponse>("/issues/report", payload);
    return response.data;
  },

  /**
   * Fetches all issues from the backend.
   * @returns A list of issues.
   */
  async getIssues(): Promise<Issue[]> {
    const response = await api.get<Issue[]>("/issues");
    return response.data;
  },

  /**
   * Fetches a single issue by ID from the backend.
   * @param issueId The issue ID.
   * @returns The issue details.
   */
  async getIssueById(issueId: string): Promise<Issue> {
    const response = await api.get<Issue>(`/issues/${issueId}`);
    return response.data;
  },

  /**
   * Upvotes/supports a community issue.
   * @param issueId The issue ID.
   * @returns The support count and status.
   */
  async supportIssue(issueId: string): Promise<SupportResponse> {
    const response = await api.patch<SupportResponse>(`/issues/${issueId}/support`);
    return response.data;
  },
};

export interface SupportResponse {
  id: string;
  support_count: number;
}
