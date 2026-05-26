import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { SubscriptionService } from "@/src/features/subscriptions/services/subscriptions.services";
import { handleError } from "@/src/utils/error-handler";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { SUBSCRIPTION_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

export const useSubscriptionTypeEnum = (enabled = true) => {
  const typeEnumQuery = useQuery({
    queryKey: SUBSCRIPTION_KEYS.typeEnum(),
    queryFn: () => SubscriptionService.getTypeEnum(),
    select: (data) =>
      mapToSelectOptions({ data, labelKey: "name", valueKey: "value" }),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (typeEnumQuery.error) handleError(typeEnumQuery.error as Error);
  }, [typeEnumQuery.error]);

  return {
    subscriptionTypeEnum: (typeEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingSubscriptionTypeEnum: typeEnumQuery.isPending,
    typeEnumQuery,
  };
};
