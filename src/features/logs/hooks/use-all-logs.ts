import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import type { IGetPaginatedParams } from "@/src/interfaces";
import { INITIAL_PAGINATE } from "@/src/constants/paginate";
import { useComponentStore } from "@/src/store";
import { LogService } from "@/src/features/logs/services/logs.services";
import { LOG_KEYS } from "./query-key";
import type { IGetAllLogsResponse, IGetLogs } from "./types";
import dayjs from "dayjs";

export const LOGS_COMPONENT_FILTER_KEY = "logs";

export const INITIAL_LOGS_FILTERS: IGetPaginatedParams = {
  ...INITIAL_PAGINATE,
  search: "",
  startDate: dayjs().subtract(7, "days").format("YYYY-MM-DD"),
  endDate: dayjs().format("YYYY-MM-DD"),
};

export function useAllLogs(params?: IGetLogs) {
  const storedFilters = useComponentStore(
    (state) =>
      state.states[LOGS_COMPONENT_FILTER_KEY]?.filters as
        | IGetPaginatedParams
        | undefined,
  );
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);

  const filters = useMemo<IGetPaginatedParams>(
    () => storedFilters || { ...INITIAL_LOGS_FILTERS, ...params },
    [params, storedFilters],
  );

  const setFilters = useCallback(
    (newFilters: IGetPaginatedParams) =>
      setFiltersGlobal(LOGS_COMPONENT_FILTER_KEY, newFilters),
    [setFiltersGlobal],
  );

  const resetFilters = useCallback(
    () => resetFiltersGlobal(LOGS_COMPONENT_FILTER_KEY, INITIAL_LOGS_FILTERS),
    [resetFiltersGlobal],
  );

  const query = useQuery({
    queryKey: LOG_KEYS.list(filters),
    queryFn: () => LogService.getAll(filters),
    placeholderData: (previousData: IGetAllLogsResponse | undefined) =>
      previousData,
    enabled: params?.enabled ?? true,
  });

  useEffect(() => {
    if (!storedFilters) {
      setFilters(filters);
    }
  }, [filters, setFilters, storedFilters]);

  return {
    ...query,
    filters,
    setFilters,
    resetFilters,
  };
}
