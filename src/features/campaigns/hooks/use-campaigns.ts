import { useQuery } from "@tanstack/react-query";
import { CampaignService } from "@/src/features/campaigns/services/campaigns.services";
import { CAMPAIGNS } from "./query-key";
import type { IGetCampaigns } from "./types";

const DEFAULT_LIMIT = 20;

export function useCampaigns(params: IGetCampaigns = {}) {
  const page = params.page ?? 1;
  const size = params.size ?? DEFAULT_LIMIT;
  const normalizedSearch = params.search?.trim() ?? "";

  return useQuery({
    queryKey: [CAMPAIGNS, page, size, normalizedSearch],
    queryFn: () =>
      CampaignService.getPaginated({
        page,
        size,
        search: normalizedSearch || undefined,
      }),
    placeholderData: (previousData) => previousData,
    enabled: params.enabled ?? true,
  });
}

export { DEFAULT_LIMIT as CAMPAIGNS_PAGE_SIZE };
