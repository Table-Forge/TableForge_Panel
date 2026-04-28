import { INITIAL_PAGINATE } from "@/src/constants/paginate";
import { GameSystemService } from "@/src/features/game-systems/services/game-systems.services";
import type { IGetPaginatedParams } from "@/src/interfaces";
import { useComponentStore } from "@/src/store";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { GAME_SYSTEM_KEYS } from "./query-key";
import type { IGetAllGameSystemsResponse, IGetGameSystems } from "./types";

export const GAME_SYSTEMS_COMPONENT_FILTER_KEY = "game-systems";

export const INITIAL_GAME_SYSTEMS_FILTERS: IGetPaginatedParams = {
  ...INITIAL_PAGINATE,
  search: "",
};

export function useAllGameSystems(params?: IGetGameSystems) {
  const storedFilters = useComponentStore(
    (state) =>
      state.states[GAME_SYSTEMS_COMPONENT_FILTER_KEY]?.filters as
        | IGetPaginatedParams
        | undefined,
  );
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);

  const filters = useMemo<IGetPaginatedParams>(
    () => storedFilters || { ...INITIAL_GAME_SYSTEMS_FILTERS, ...params },
    [params, storedFilters],
  );

  const setFilters = useCallback(
    (newFilters: IGetPaginatedParams) =>
      setFiltersGlobal(GAME_SYSTEMS_COMPONENT_FILTER_KEY, newFilters),
    [setFiltersGlobal],
  );

  const resetFilters = useCallback(
    () =>
      resetFiltersGlobal(
        GAME_SYSTEMS_COMPONENT_FILTER_KEY,
        INITIAL_GAME_SYSTEMS_FILTERS,
      ),
    [resetFiltersGlobal],
  );

  const query = useQuery({
    queryKey: GAME_SYSTEM_KEYS.list(filters),
    queryFn: () => GameSystemService.getAll(filters),
    placeholderData: (previousData: IGetAllGameSystemsResponse | undefined) =>
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
