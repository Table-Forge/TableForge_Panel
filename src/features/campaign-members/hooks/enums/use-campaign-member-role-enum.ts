import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { CampaignMemberService } from "@/src/features/campaign-members/services/campaign-members.services";
import { handleError } from "@/src/utils/error-handler";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { CAMPAIGN_MEMBER_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

export const useCampaignMemberRoleEnum = (enabled = true) => {
  const roleEnumQuery = useQuery({
    queryKey: CAMPAIGN_MEMBER_KEYS.roleEnum(),
    queryFn: () => CampaignMemberService.getRoleEnum(),
    select: (data) =>
      mapToSelectOptions({ data, labelKey: "name", valueKey: "value" }),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (roleEnumQuery.error) handleError(roleEnumQuery.error as Error);
  }, [roleEnumQuery.error]);

  return {
    campaignMemberRoleEnum: (roleEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingCampaignMemberRoleEnum: roleEnumQuery.isPending,
    roleEnumQuery,
  };
};
