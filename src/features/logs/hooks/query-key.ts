import type { IGetLogs } from "./types";

export const LOG_KEYS = {
  all: ["logs"] as const,
  lists: () => [...LOG_KEYS.all, "list"] as const,
  list: (filters: IGetLogs = {}) => [...LOG_KEYS.lists(), filters] as const,
  details: () => [...LOG_KEYS.all, "detail"] as const,
  detail: (id?: number) => [...LOG_KEYS.details(), id] as const,
  enums: () => [...LOG_KEYS.all, "enums"] as const,
  logTypeEnum: () => [...LOG_KEYS.enums(), "log-type"] as const,
};
