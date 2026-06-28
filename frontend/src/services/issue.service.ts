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
};
