export type JuryId = number;

export type JuryContestStatus = "draft" | "voting" | "closed" | "archived";
export type JuryEvaluationStatus = "draft" | "submitted" | "locked";

export interface JuryContest {
  id: JuryId;
  title: string;
  sort?: number;
  description?: string | null;
  description_html?: string | null;
  created_at?: string;
  updated_at?: string;
  year: number;
  project_id: number | null;
  status: JuryContestStatus;
  start_at: string | null;
  end_at: string | null;
  timezone: string | null;
  allow_edit: boolean;
  logo?: unknown;
  rules_html: string | null;
}

export interface JuryDashboard {
  contest: JuryContest | null;
  total_works: number;
  evaluated_works: number;
  remaining_works: number;
  seconds_remaining: number;
  finalized: boolean;
  can_edit: boolean;
  jury_user_id: JuryId;
}

export interface JuryNomination {
  id: JuryId;
  contest_id: JuryId;
  title: string;
  description: string | null;
  sort: number;
}

export interface JuryWorksParams {
  page?: number;
  per_page?: number;
}

export interface JuryWorkSummary {
  id: JuryId;
  title: string;
  organization: string | null;
  description: string | null;
  // The contract does not specify the cover object's shape.
  cover: unknown;
  nomination_id: JuryId;
  evaluation_status: JuryEvaluationStatus | null;
  can_edit: boolean;
}

export interface JuryCriterion {
  id: JuryId;
  title: string;
  description: string | null;
  min_score: number;
  max_score: number;
  set_version: number;
}

export interface JuryMaterial {
  id: string;
  url: string;
  name: string;
}

export interface JuryScore {
  criterion_id: JuryId;
  value: number;
}

export interface JuryEvaluation {
  version: number;
  criteria_version: number;
  status: JuryEvaluationStatus;
  scores: JuryScore[];
  criteria_snapshot?: unknown;
  total: number;
  confirmed_at: string | null;
}

export interface JuryWork extends Pick<JuryWorkSummary, "id" | "title">,
  Partial<Omit<JuryWorkSummary, "id" | "title">> {
  nomination: JuryNomination;
  criteria_version: number;
  criteria: JuryCriterion[];
  materials: JuryMaterial[];
  evaluation: JuryEvaluation | null;
}

export interface JuryEvaluationState {
  evaluation: JuryEvaluation | null;
  can_edit: boolean;
}

export interface JurySaveEvaluationPayload {
  contest_id: JuryId;
  nomination_id: JuryId;
  version: number;
  criteria_version: number;
  status?: "draft" | "submitted";
  request_id: string;
  scores: JuryScore[];
}

export interface JuryEvaluationHistoryEvent {
  id: JuryId;
  action: "evaluation.created" | "evaluation.updated" | "evaluation.submitted" | "evaluation.locked";
  version: number;
  created_at: string;
  old: unknown;
  new: unknown;
}

export interface JuryFinalizePayload {
  request_id: string;
}

export interface JuryFinalizeResult {
  contest_id: JuryId;
  finalized: boolean;
  confirmed_at: string;
}

export type JuryDashboardResponse = ApiSuccessResponse<JuryDashboard>;
export type JuryContestsResponse = ApiSuccessResponse<{ items: JuryContest[] }>;
export type JuryContestResponse = ApiSuccessResponse<JuryContest>;
export type JuryNominationsResponse = ApiSuccessResponse<{ items: JuryNomination[] }>;
export type JuryWorksResponse = ApiSuccessResponse<{
  items: JuryWorkSummary[];
  pagination: Pagination;
}>;
export type JuryWorkResponse = ApiSuccessResponse<JuryWork>;
export type JuryEvaluationResponse = ApiSuccessResponse<JuryEvaluationState>;
export type JurySaveEvaluationResponse = ApiSuccessResponse<JuryEvaluation>;
export type JuryEvaluationHistoryResponse = ApiSuccessResponse<{
  items: JuryEvaluationHistoryEvent[];
}>;
export type JuryFinalizeResponse = ApiSuccessResponse<JuryFinalizeResult>;

export interface JuryApiErrorResponse {
  status: "error";
  message: string;
  errors: string | Record<string, unknown>;
}
