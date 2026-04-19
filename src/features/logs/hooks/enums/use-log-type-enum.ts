import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { LogService } from "@/src/features/logs/services/logs.services";
import { handleError } from "@/src/utils/error-handler";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { LOG_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseLogTypeEnumProps {
  enabled?: boolean;
  filterAllowed?: boolean;
}

export const useLogTypeEnum = ({
  enabled = true,
  filterAllowed = true,
}: IUseLogTypeEnumProps = {}) => {
  const logTypeEnumQuery = useQuery({
    queryKey: LOG_KEYS.logTypeEnum(),
    queryFn: () => LogService.getLogTypeEnum(),
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
    if (logTypeEnumQuery.error) {
      handleError(logTypeEnumQuery.error as Error);
    }
  }, [logTypeEnumQuery.error]);

  return {
    logTypeEnum: (logTypeEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingLogTypeEnum: logTypeEnumQuery.isPending,
    isLoading: logTypeEnumQuery.isPending,
    logTypeEnumQuery,
  };
};
