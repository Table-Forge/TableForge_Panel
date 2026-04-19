import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { UserService } from "@/src/features/users/services/users.services";
import { handleError } from "@/src/utils/error-handler";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { USER_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseUserGenderEnumProps {
  enabled?: boolean;
  filterAllowed?: boolean;
}

export const useUserGenderEnum = ({
  enabled = true,
  filterAllowed = true,
}: IUseUserGenderEnumProps = {}) => {
  const genderEnumQuery = useQuery({
    queryKey: USER_KEYS.genderEnum(),
    queryFn: () => UserService.getGenderEnum(),
    select: (data) =>
      mapToSelectOptions({
        data,
        labelKey: "name",
        valueKey: "value",
        filterAllowed,
      }),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (genderEnumQuery.error) {
      handleError(genderEnumQuery.error as Error);
    }
  }, [genderEnumQuery.error]);

  return {
    genderEnum: (genderEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingGenderEnum: genderEnumQuery.isPending,
    genderEnumQuery,
  };
};
