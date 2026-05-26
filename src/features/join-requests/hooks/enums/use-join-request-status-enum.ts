import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { JoinRequestService } from "@/src/features/join-requests/services/join-requests.services";
import { handleError } from "@/src/utils/error-handler";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { JOIN_REQUEST_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

export const useJoinRequestStatusEnum = (enabled = true) => {
  const statusEnumQuery = useQuery({
    queryKey: JOIN_REQUEST_KEYS.statusEnum(),
    queryFn: () => JoinRequestService.getStatusEnum(),
    select: (data) =>
      mapToSelectOptions({ data, labelKey: "name", valueKey: "value" }),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (statusEnumQuery.error) handleError(statusEnumQuery.error as Error);
  }, [statusEnumQuery.error]);

  return {
    joinRequestStatusEnum: (statusEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingJoinRequestStatusEnum: statusEnumQuery.isPending,
    statusEnumQuery,
  };
};
