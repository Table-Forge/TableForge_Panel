import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { UserService } from "@/src/features/users/services/users.services";
import { handleError } from "@/src/utils/error-handler";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { USER_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

export const useUserTypeEnum = (enabled = true) => {
  const typeEnumQuery = useQuery({
    queryKey: USER_KEYS.typeEnum(),
    queryFn: () => UserService.getTypeEnum(),
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
    if (typeEnumQuery.error) {
      handleError(typeEnumQuery.error as Error);
    }
  }, [typeEnumQuery.error]);

  return {
    typeEnum: (typeEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingTypeEnum: typeEnumQuery.isPending,
    typeEnumQuery,
  };
};
