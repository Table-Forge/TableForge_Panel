import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { CampaignService } from "@/src/features/campaigns/services/campaigns.services";
import { handleError } from "@/src/utils/error-handler";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { CAMPAIGN_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

export const useCampaignFrequencyEnum = (enabled = true) => {
  const frequencyEnumQuery = useQuery({
    queryKey: [...CAMPAIGN_KEYS.all, "enum", "frequency"],
    queryFn: () => CampaignService.getCampaignFrequencyEnum(),
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
    if (frequencyEnumQuery.error) {
      handleError(frequencyEnumQuery.error as Error);
    }
  }, [frequencyEnumQuery.error]);

  return {
    frequencyEnum: (frequencyEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingFrequencyEnum: frequencyEnumQuery.isPending,
    frequencyEnumQuery,
  };
};
