import type { IGetRaces } from "./types";

export const RACE_KEYS = {
  all: ["races"] as const,
  lists: () => [...RACE_KEYS.all, "list"] as const,
  list: (filters: IGetRaces = {}) => [...RACE_KEYS.lists(), filters] as const,
  details: () => [...RACE_KEYS.all, "detail"] as const,
  detail: (id?: number) => [...RACE_KEYS.details(), id] as const,
};
