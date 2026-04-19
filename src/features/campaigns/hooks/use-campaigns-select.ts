import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { useMemo, useState } from "react";
import { useAllCampaigns } from "./use-all-campaigns";
import type { IGetCampaigns } from "./types";
import { INITIAL_PAGINATE } from "@/src/constants/paginate";

export const useCampaignsSelect = ({ enabled = true }: IGetCampaigns = {}) => {
  const [search, setSearch] = useState("");

  const campaignsQuery = useAllCampaigns({
    ...INITIAL_PAGINATE,
    search,
    enabled,
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

  return {
    campaignOptions,
    isLoadingCampaignsSelect: campaignsQuery.isPending,
    onSearchCampaigns: (value: string) => setSearch(value.trim()),
    campaignsQuery,
  };
};

