import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { useMemo, useState } from "react";
import { useCampaigns } from "./use-campaigns";

interface IUseCampaignsSelectProps {
  enabled?: boolean;
  size?: number;
}

const DEFAULT_SIZE = 50;

export const useCampaignsSelect = ({
  enabled = true,
  size = DEFAULT_SIZE,
}: IUseCampaignsSelectProps = {}) => {
  const [search, setSearch] = useState("");

  const campaignsQuery = useCampaigns({
    page: 1,
    size,
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
