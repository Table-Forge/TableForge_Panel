import type { IGetClasses } from "./types";

export const CLASS_KEYS = {
  all: ["classes"] as const,
  lists: () => [...CLASS_KEYS.all, "list"] as const,
  list: (filters: IGetClasses = {}) => [...CLASS_KEYS.lists(), filters] as const,
  details: () => [...CLASS_KEYS.all, "detail"] as const,
  detail: (id?: number) => [...CLASS_KEYS.details(), id] as const,
};
