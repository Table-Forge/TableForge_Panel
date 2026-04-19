import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { UserService } from "@/src/features/users/services/users.services";
import { handleError } from "@/src/utils/error-handler";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { USER_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseUserDeliveryMethodEnumProps {
  enabled?: boolean;
  filterAllowed?: boolean;
}

export const useUserDeliveryMethodEnum = ({
  enabled = true,
  filterAllowed = true,
}: IUseUserDeliveryMethodEnumProps = {}) => {
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
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (deliveryMethodEnumQuery.error) {
      handleError(deliveryMethodEnumQuery.error as Error);
    }
  }, [deliveryMethodEnumQuery.error]);

  return {
    deliveryMethodEnum: (deliveryMethodEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingDeliveryMethodEnum: deliveryMethodEnumQuery.isPending,
    deliveryMethodEnumQuery,
  };
};
