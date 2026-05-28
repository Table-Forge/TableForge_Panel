import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { INITIAL_PAGINATE } from "@/src/constants/paginate";
import { CampaignService } from "@/src/features/campaigns/services/campaigns.services";
import { useDebouncedCallback } from "@/src/hooks/utils/useDebouncedCallback";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CAMPAIGN_KEYS } from "./query-key";
import type { IGetAllCampaignsResponse, IGetCampaigns } from "./types";

const SEARCH_DEBOUNCE_MS = 500;
const SELECT_STALE_TIME_MS = 1000 * 60 * 30;

export const useCampaignsSelect = ({ enabled = true }: IGetCampaigns = {}) => {
  const [search, setSearch] = useState("");

  const filters = { ...INITIAL_PAGINATE, search };

  const campaignsQuery = useQuery({
    queryKey: CAMPAIGN_KEYS.list(filters),
    queryFn: () => CampaignService.getAll(filters),
    placeholderData: (previousData: IGetAllCampaignsResponse | undefined) =>
      previousData,
    enabled,
    staleTime: SELECT_STALE_TIME_MS,
  });

  const campaignOptions = useMemo<TSelectOptions[]>(
    () =>
      (campaignsQuery.data?.items ?? [])
        .filter((campaign) => typeof campaign.id === "number")
        .map((campaign) => ({
          id: campaign.id,
          value: campaign.id,
          name: campaign.title || `Campanha ${campaign.id}`,
        })),
    [campaignsQuery.data?.items],
  );

  const onSearchCampaigns = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
  }, SEARCH_DEBOUNCE_MS);

  return {
    campaignOptions,
    isLoadingCampaignsSelect: campaignsQuery.isPending,
    onSearchCampaigns,
    campaignsQuery,
  };
};
