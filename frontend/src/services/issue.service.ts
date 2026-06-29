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
   * Fetches issues matching the given filter parameters from the backend.
   * @param params An object with optional category and status.
   * @returns A list of filtered issues.
   */
  async getFilteredIssues(params: { category?: string; status?: string }): Promise<Issue[]> {
    const response = await api.get<Issue[]>("/issues/filter", { params });
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

  /**
   * Fetches nearby issues from the backend based on latitude, longitude, and radius (in meters).
   * @param latitude
   * @param longitude
   * @param radiusMeters
   * @returns A list of nearby issues.
   */
  async getNearbyIssues(latitude: number, longitude: number, radiusMeters: number): Promise<Issue[]> {
    const response = await api.get<Issue[]>("/issues/nearby", {
      params: {
        latitude,
        longitude,
        radius_km: radiusMeters / 1000,
      },
    });
    return response.data;
  },

  /**
   * Fetches the dashboard overview summary data from the backend.
   */
  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await api.get<DashboardSummary>("/issues/dashboard/summary");
    return response.data;
  },

  /**
   * Fetches the dashboard category analytics data from the backend.
   */
  async getDashboardCategories(): Promise<CategoryAnalytics> {
    const response = await api.get<CategoryAnalytics>("/issues/dashboard/categories");
    return response.data;
  },
};

export interface SupportResponse {
  id: string;
  support_count: number;
}

export interface DashboardSummary {
  total_issues: number;
  reported: number;
  in_progress: number;
  resolved: number;
}

export interface CategoryAnalytics {
  categories: Record<string, number>;
}

