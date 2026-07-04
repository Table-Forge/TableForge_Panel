import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import type { IGetPaginatedParams } from "@/src/interfaces";
import { useComponentStore } from "@/src/store";
import { useDebouncedCallback } from "@/src/hooks/utils/useDebouncedCallback";
import { INITIAL_PAGINATE } from "@/src/constants/paginate";
import { BannersService } from "../services/banners.services";
import type { IBanner } from "../schemas/banner.schema";
import type { IPaginationResponse } from "@/src/interfaces";

export const BANNERS_COMPONENT_FILTER_KEY = "banners";

export const INITIAL_BANNERS_FILTERS: IGetPaginatedParams = {
  ...INITIAL_PAGINATE,
  search: "",
};

const SEARCH_DEBOUNCE_MS = 500;

export const useAllBanners = (params?: IGetPaginatedParams) => {
  const storedFilters = useComponentStore(
    (state) =>
      state.states[BANNERS_COMPONENT_FILTER_KEY]?.filters as
        | IGetPaginatedParams
        | undefined,
  );
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);

  const filters = useMemo<IGetPaginatedParams>(
    () => storedFilters || { ...INITIAL_BANNERS_FILTERS, ...params },
    [params, storedFilters],
  );

  const setFilters = useCallback(
    (newFilters: IGetPaginatedParams) =>
      setFiltersGlobal(BANNERS_COMPONENT_FILTER_KEY, newFilters),
    [setFiltersGlobal],
  );

  const resetFilters = useCallback(
    () =>
      resetFiltersGlobal(
        BANNERS_COMPONENT_FILTER_KEY,
        INITIAL_BANNERS_FILTERS,
      ),
    [resetFiltersGlobal],
  );

  const query = useQuery({
    queryKey: ["banners", "all", filters],
    queryFn: () => BannersService.getPaginated(filters),
    placeholderData: (previousData: { items: IBanner[], pagination: IPaginationResponse } | undefined) => previousData,
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
};
