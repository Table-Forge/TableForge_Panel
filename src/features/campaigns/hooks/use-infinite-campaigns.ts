import { useInfiniteQuery } from "@tanstack/react-query";
import { CAMPAIGN_KEYS } from "@/src/features/campaigns/hooks/query-key";
import { CampaignService } from "@/src/features/campaigns/services/campaigns.services";

const DEFAULT_LIMIT = 20;

interface IUseInfiniteCampaignsParams {
  size?: number;
  search?: string;
}

export function useInfiniteCampaigns({
  size = DEFAULT_LIMIT,
  search = "",
}: IUseInfiniteCampaignsParams = {}) {
  const normalizedSearch = search.trim();

  return useInfiniteQuery({
    queryKey: CAMPAIGN_KEYS.infinite({ size, search: normalizedSearch }),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      CampaignService.getPaginated({
        page: Number(pageParam),
        size,
        search: normalizedSearch || undefined,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
  });
}

export { DEFAULT_LIMIT as CAMPAIGNS_PAGE_SIZE };
