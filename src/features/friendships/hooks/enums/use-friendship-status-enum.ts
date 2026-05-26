import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { FriendshipService } from "@/src/features/friendships/services/friendships.services";
import { handleError } from "@/src/utils/error-handler";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FRIENDSHIP_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

export const useFriendshipStatusEnum = (enabled = true) => {
  const statusEnumQuery = useQuery({
    queryKey: FRIENDSHIP_KEYS.statusEnum(),
    queryFn: () => FriendshipService.getStatusEnum(),
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
    friendshipStatusEnum: (statusEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingFriendshipStatusEnum: statusEnumQuery.isPending,
    statusEnumQuery,
  };
};
