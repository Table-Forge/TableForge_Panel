import type { IGetCampaigns } from "./types";

export const CAMPAIGN_KEYS = {
  all: ["campaigns"] as const,
  lists: () => [...CAMPAIGN_KEYS.all, "list"] as const,
  list: (filters: IGetCampaigns = {}) => [...CAMPAIGN_KEYS.lists(), filters] as const,
  details: () => [...CAMPAIGN_KEYS.all, "detail"] as const,
  detail: (id?: number) => [...CAMPAIGN_KEYS.details(), id] as const,
  enums: () => [...CAMPAIGN_KEYS.all, "enums"] as const,
  difficultyLevelEnum: () =>
    [...CAMPAIGN_KEYS.enums(), "difficulty-level"] as const,
  campaignStatusEnum: () =>
    [...CAMPAIGN_KEYS.enums(), "campaign-status"] as const,
};
