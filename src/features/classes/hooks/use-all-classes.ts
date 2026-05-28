import { INITIAL_PAGINATE } from "@/src/constants/paginate";
import { ClassService } from "@/src/features/classes/services/classes.services";
import { useDebouncedCallback } from "@/src/hooks/utils/useDebouncedCallback";
import type { IGetPaginatedParams } from "@/src/interfaces";
import { useComponentStore } from "@/src/store";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { CLASS_KEYS } from "./query-key";
import type { IGetAllClassesResponse, IGetClasses } from "./types";

export const CLASSES_COMPONENT_FILTER_KEY = "classes";

export const INITIAL_CLASSES_FILTERS: IGetPaginatedParams = {
  ...INITIAL_PAGINATE,
  search: "",
};

const SEARCH_DEBOUNCE_MS = 500;

export function useAllClasses(params?: IGetClasses) {
  const storedFilters = useComponentStore(
    (state) =>
      state.states[CLASSES_COMPONENT_FILTER_KEY]?.filters as
        | IGetPaginatedParams
        | undefined,
  );
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);

  const filters = useMemo<IGetPaginatedParams>(
    () => storedFilters || { ...INITIAL_CLASSES_FILTERS, ...params },
    [params, storedFilters],
  );

  const setFilters = useCallback(
    (newFilters: IGetPaginatedParams) =>
      setFiltersGlobal(CLASSES_COMPONENT_FILTER_KEY, newFilters),
    [setFiltersGlobal],
  );

  const resetFilters = useCallback(
    () =>
      resetFiltersGlobal(CLASSES_COMPONENT_FILTER_KEY, INITIAL_CLASSES_FILTERS),
    [resetFiltersGlobal],
  );

  const query = useQuery({
    queryKey: CLASS_KEYS.list(filters),
    queryFn: () => ClassService.getAll(filters),
    placeholderData: (previousData: IGetAllClassesResponse | undefined) =>
      previousData,
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
