import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { INITIAL_PAGINATE } from "@/src/constants/paginate";
import { RequestHistoryService } from "@/src/features/request-history/services/request-history.services";
import { useDebouncedCallback } from "@/src/hooks/utils/useDebouncedCallback";
import { useComponentStore } from "@/src/store";
import { REQUEST_HISTORY_KEYS } from "./query-key";
import type {
  IGetAllRequestHistoryResponse,
  IGetRequestHistory,
} from "./types";

export const REQUEST_HISTORY_COMPONENT_FILTER_KEY = "request-history";

export const INITIAL_REQUEST_HISTORY_FILTERS: IGetRequestHistory = {
  ...INITIAL_PAGINATE,
  search: "",
  startDate: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
  endDate: dayjs().format("YYYY-MM-DD"),
  userId: "",
  statusCode: "",
  minTotalMs: "",
  onlyWithDetails: false,
};

const SEARCH_DEBOUNCE_MS = 500;

export function useAllRequestHistory(params?: IGetRequestHistory) {
  const storedFilters = useComponentStore(
    (state) =>
      state.states[REQUEST_HISTORY_COMPONENT_FILTER_KEY]?.filters as
        | IGetRequestHistory
        | undefined,
  );
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);

  const filters = useMemo<IGetRequestHistory>(
    () => storedFilters || { ...INITIAL_REQUEST_HISTORY_FILTERS, ...params },
    [params, storedFilters],
  );

  const setFilters = useCallback(
    (newFilters: IGetRequestHistory) =>
      setFiltersGlobal(REQUEST_HISTORY_COMPONENT_FILTER_KEY, newFilters),
    [setFiltersGlobal],
  );

  const resetFilters = useCallback(
    () =>
      resetFiltersGlobal(
        REQUEST_HISTORY_COMPONENT_FILTER_KEY,
        INITIAL_REQUEST_HISTORY_FILTERS,
      ),
    [resetFiltersGlobal],
  );

  const query = useQuery({
    queryKey: REQUEST_HISTORY_KEYS.list(filters),
    queryFn: () => RequestHistoryService.getAll(filters),
    placeholderData: (
      previousData: IGetAllRequestHistoryResponse | undefined,
    ) => previousData,
    enabled: params?.enabled ?? true,
  });

  useEffect(() => {
    if (!storedFilters) {
      setFilters(filters);
    }
  }, [filters, setFilters, storedFilters]);

  const onSearchChange = useDebouncedCallback((value: string) => {
    setFilters({ ...filters, page: 1, search: value });
  }, SEARCH_DEBOUNCE_MS);

  return {
    ...query,
    filters,
    setFilters,
    resetFilters,
    onSearchChange,
  };
}
