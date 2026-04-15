import type { IGetCampaigns } from "./types";

interface ICampaignPaginationKeyParams {
  page: number;
  size: number;
  search: string;
}

interface ICampaignInfiniteKeyParams {
  size: number;
  search: string;
}

export const CAMPAIGN_KEYS = {
  all: ["campaigns"] as const,
  lists: () => [...CAMPAIGN_KEYS.all, "list"] as const,
  list: (params?: IGetCampaigns) => [...CAMPAIGN_KEYS.lists(), "all", params] as const,
  paginated: (params: ICampaignPaginationKeyParams) =>
    [...CAMPAIGN_KEYS.lists(), "paginated", params] as const,
  infinite: (params: ICampaignInfiniteKeyParams) =>
    [...CAMPAIGN_KEYS.lists(), "infinite", params] as const,
};
