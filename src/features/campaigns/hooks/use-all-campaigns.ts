import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import type { IGetPaginatedParams } from "@/src/interfaces";
import { INITIAL_PAGINATE } from "@/src/constants/paginate";
import { useComponentStore } from "@/src/store";
import { CampaignService } from "@/src/features/campaigns/services/campaigns.services";
import { useDebouncedCallback } from "@/src/hooks/utils/useDebouncedCallback";
import { CAMPAIGN_KEYS } from "./query-key";
import type { IGetAllCampaignsResponse, IGetCampaigns } from "./types";

export const CAMPAIGNS_COMPONENT_FILTER_KEY = "campaigns";

export const INITIAL_CAMPAIGNS_FILTERS: IGetPaginatedParams = {
  ...INITIAL_PAGINATE,
  search: "",
};

const SEARCH_DEBOUNCE_MS = 500;

export function useAllCampaigns(params?: IGetCampaigns) {
  const storedFilters = useComponentStore(
    (state) =>
      state.states[CAMPAIGNS_COMPONENT_FILTER_KEY]?.filters as
        | IGetPaginatedParams
        | undefined,
  );
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);

  const filters = useMemo<IGetPaginatedParams>(
    () => storedFilters || { ...INITIAL_CAMPAIGNS_FILTERS, ...params },
    [params, storedFilters],
  );

  const setFilters = useCallback(
    (newFilters: IGetPaginatedParams) =>
      setFiltersGlobal(CAMPAIGNS_COMPONENT_FILTER_KEY, newFilters),
    [setFiltersGlobal],
  );

  const resetFilters = useCallback(
    () =>
      resetFiltersGlobal(CAMPAIGNS_COMPONENT_FILTER_KEY, INITIAL_CAMPAIGNS_FILTERS),
    [resetFiltersGlobal],
  );

  const query = useQuery({
    queryKey: CAMPAIGN_KEYS.list(filters),
    queryFn: () => CampaignService.getAll(filters),
    placeholderData: (previousData: IGetAllCampaignsResponse | undefined) =>
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
