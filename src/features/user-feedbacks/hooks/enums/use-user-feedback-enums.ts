import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { USER_FEEDBACKS_KEYS } from "../query-keys";
import { UserFeedbackService } from "../../services/user-feedbacks.services";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

export const useUserFeedbackStatusEnum = (enabled = true, filterAllowed = true) => {
  const statusEnumQuery = useQuery({
    queryKey: USER_FEEDBACKS_KEYS.statusEnum(),
    queryFn: () => UserFeedbackService.getFeedbackStatusEnum(),
    select: (data) =>
      mapToSelectOptions({ data, labelKey: "name", valueKey: "value", filterAllowed }),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  return {
    statusEnum: (statusEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingStatusEnum: statusEnumQuery.isPending,
    statusEnumQuery,
  };
};

export const useUserFeedbackCategoryEnum = (enabled = true, filterAllowed = true) => {
  const categoryEnumQuery = useQuery({
    queryKey: USER_FEEDBACKS_KEYS.categoryEnum(),
    queryFn: () => UserFeedbackService.getFeedbackCategoryEnum(),
    select: (data) =>
      mapToSelectOptions({ data, labelKey: "name", valueKey: "value", filterAllowed }),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  return {
    categoryEnum: (categoryEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingCategoryEnum: categoryEnumQuery.isPending,
    categoryEnumQuery,
  };
};
