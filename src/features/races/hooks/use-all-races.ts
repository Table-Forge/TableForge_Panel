import { INITIAL_PAGINATE } from "@/src/constants/paginate";
import { RaceService } from "@/src/features/races/services/races.services";
import type { IGetPaginatedParams } from "@/src/interfaces";
import { useComponentStore } from "@/src/store";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { RACE_KEYS } from "./query-key";
import type { IGetAllRacesResponse, IGetRaces } from "./types";

export const RACES_COMPONENT_FILTER_KEY = "races";

export const INITIAL_RACES_FILTERS: IGetPaginatedParams = {
  ...INITIAL_PAGINATE,
  search: "",
};

export function useAllRaces(params?: IGetRaces) {
  const storedFilters = useComponentStore(
    (state) =>
      state.states[RACES_COMPONENT_FILTER_KEY]?.filters as
        | IGetPaginatedParams
        | undefined,
  );
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);

  const filters = useMemo<IGetPaginatedParams>(
    () => storedFilters || { ...INITIAL_RACES_FILTERS, ...params },
    [params, storedFilters],
  );

  const setFilters = useCallback(
    (newFilters: IGetPaginatedParams) =>
      setFiltersGlobal(RACES_COMPONENT_FILTER_KEY, newFilters),
    [setFiltersGlobal],
  );

  const resetFilters = useCallback(
    () => resetFiltersGlobal(RACES_COMPONENT_FILTER_KEY, INITIAL_RACES_FILTERS),
    [resetFiltersGlobal],
  );

  const query = useQuery({
    queryKey: RACE_KEYS.list(filters),
    queryFn: () => RaceService.getAll(filters),
    placeholderData: (previousData: IGetAllRacesResponse | undefined) =>
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
