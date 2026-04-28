import type { IGetGameSystems } from "./types";

export const GAME_SYSTEM_KEYS = {
  all: ["game-systems"] as const,
  lists: () => [...GAME_SYSTEM_KEYS.all, "list"] as const,
  list: (filters: IGetGameSystems = {}) =>
    [...GAME_SYSTEM_KEYS.lists(), filters] as const,
  details: () => [...GAME_SYSTEM_KEYS.all, "detail"] as const,
  detail: (id?: number) => [...GAME_SYSTEM_KEYS.details(), id] as const,
};
