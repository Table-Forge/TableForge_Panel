import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { handleError } from "@/src/utils/error-handler";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { UserService } from "../services/users.services";
import { USER_KEYS } from "./query-key";

export const useUserStatusEnum = (enabled = true) => {
  const statusEnumQuery = useQuery({
    queryKey: USER_KEYS.statusEnum(),
    queryFn: () => UserService.getStatusEnum(),
    enabled,
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
