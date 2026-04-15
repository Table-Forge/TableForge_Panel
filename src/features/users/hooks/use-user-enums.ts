import { handleError } from "@/src/utils/error-handler";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { UserService } from "../services/users.services";
import { USER_KEYS } from "./query-key";

interface IUseUserEnumsProps {
  enabled?: boolean;
  filterAllowed?: boolean;
}

export const useUserEnums = ({
  enabled = true,
  filterAllowed = true,
}: IUseUserEnumsProps = {}) => {
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
  });

  const statusEnumQuery = useQuery({
    queryKey: USER_KEYS.statusEnum(),
    queryFn: () => UserService.getStatusEnum(),
    select: (data) =>
      mapToSelectOptions({
        data,
        labelKey: "name",
        valueKey: "value",
        filterAllowed,
      }),
    enabled,
  });

  const deliveryMethodEnumQuery = useQuery({
    queryKey: USER_KEYS.deliveryMethodEnum(),
    queryFn: () => UserService.getDeliveryMethodEnum(),
    select: (data) =>
      mapToSelectOptions({
        data,
        labelKey: "name",
        valueKey: "value",
        filterAllowed,
      }),
    enabled,
  });

  useEffect(() => {
    const error = genderEnumQuery.error || statusEnumQuery.error;
    if (error) {
      handleError(error as Error);
    }
  }, [
    statusEnumQuery.error,
    genderEnumQuery.error,
    deliveryMethodEnumQuery.error,
  ]);

  return {
    genderEnum: (genderEnumQuery.data ?? []) as TSelectOptions[],
    statusEnum: (statusEnumQuery.data ?? []) as TSelectOptions[],
    deliveryMethodEnum: (deliveryMethodEnumQuery.data ?? []) as TSelectOptions[],

    isLoadingGenderEnum: genderEnumQuery.isPending,
    isLoadingStatusEnum: statusEnumQuery.isPending,
    isLoadingDeliveryMethodEnum: deliveryMethodEnumQuery.isPending,

    isLoading:
      genderEnumQuery.isPending ||
      statusEnumQuery.isPending ||
      deliveryMethodEnumQuery.isPending,

    statusEnumQuery,
    genderEnumQuery,
    deliveryMethodEnumQuery,
  };
};
