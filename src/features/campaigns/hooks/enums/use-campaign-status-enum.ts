import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { CampaignService } from "@/src/features/campaigns/services/campaigns.services";
import { handleError } from "@/src/utils/error-handler";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { CAMPAIGN_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

export const useCampaignStatusEnum = (enabled = true) => {
  const campaignStatusEnumQuery = useQuery({
    queryKey: CAMPAIGN_KEYS.campaignStatusEnum(),
    queryFn: () => CampaignService.getCampaignStatusEnum(),
    select: (data) =>
      mapToSelectOptions({
        data,
        labelKey: "name",
        valueKey: "value",
      }),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (campaignStatusEnumQuery.error) {
      handleError(campaignStatusEnumQuery.error as Error);
    }
  }, [campaignStatusEnumQuery.error]);

  return {
    campaignStatusEnum: (campaignStatusEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingCampaignStatusEnum: campaignStatusEnumQuery.isPending,
    campaignStatusEnumQuery,
  };
};
