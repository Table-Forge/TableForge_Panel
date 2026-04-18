import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { handleError } from "@/src/utils/error-handler";
import { LogService } from "../services/logs.services";
import { LOG_KEYS } from "./query-key";

interface IUseLogEnumsProps {
  enabled?: boolean;
  filterAllowed?: boolean;
}

export const useLogEnums = ({
  enabled = true,
  filterAllowed = true,
}: IUseLogEnumsProps = {}) => {
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
