import type { IGetRequestHistory } from "./types";

export const REQUEST_HISTORY_KEYS = {
  all: ["request-history"] as const,
  lists: () => [...REQUEST_HISTORY_KEYS.all, "list"] as const,
  list: (filters: IGetRequestHistory = {}) =>
    [...REQUEST_HISTORY_KEYS.lists(), filters] as const,
  details: () => [...REQUEST_HISTORY_KEYS.all, "detail"] as const,
  detail: (id?: number) => [...REQUEST_HISTORY_KEYS.details(), id] as const,
};
