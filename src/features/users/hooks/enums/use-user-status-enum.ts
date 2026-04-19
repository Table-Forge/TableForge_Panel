import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { UserService } from "@/src/features/users/services/users.services";
import { handleError } from "@/src/utils/error-handler";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { USER_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

export const useUserStatusEnum = (enabled = true) => {
  const statusEnumQuery = useQuery({
    queryKey: USER_KEYS.statusEnum(),
    queryFn: () => UserService.getStatusEnum(),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (statusEnumQuery.error) {
      handleError(statusEnumQuery.error as Error);
    }
  }, [statusEnumQuery.error]);

  return {
    statusEnum: (statusEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingStatusEnum: statusEnumQuery.isPending,
    statusEnumQuery,
  };
};
