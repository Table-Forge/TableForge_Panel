import type { IUserFeedbackFilters } from "../interfaces";

export const USER_FEEDBACKS_KEYS = {
  all: ["userFeedbacks"] as const,
  lists: () => [...USER_FEEDBACKS_KEYS.all, "list"] as const,
  list: (filters: IUserFeedbackFilters) => [...USER_FEEDBACKS_KEYS.lists(), { filters }] as const,
  details: () => [...USER_FEEDBACKS_KEYS.all, "detail"] as const,
  detail: (id: number) => [...USER_FEEDBACKS_KEYS.details(), id] as const,
  summaries: () => [...USER_FEEDBACKS_KEYS.all, "summary"] as const,
  summary: (from?: string, to?: string) => [...USER_FEEDBACKS_KEYS.summaries(), { from, to }] as const,
};
