import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import type { IGetPaginatedParams } from "@/src/interfaces";
import { INITIAL_PAGINATE } from "@/src/constants/paginate";
import { useComponentStore } from "@/src/store";
import { ImageService } from "@/src/features/images/services/images.services";
import { useDebouncedCallback } from "@/src/hooks/utils/useDebouncedCallback";
import { IMAGE_KEYS } from "./query-key";
import type { IGetAllImagesResponse, IGetImages } from "./types";

export const IMAGES_COMPONENT_FILTER_KEY = "images";

export const INITIAL_IMAGES_FILTERS: IGetPaginatedParams = {
  ...INITIAL_PAGINATE,
  search: "",
};

const SEARCH_DEBOUNCE_MS = 500;

export function useAllImages(params?: IGetImages) {
  const storedFilters = useComponentStore(
    (state) =>
      state.states[IMAGES_COMPONENT_FILTER_KEY]?.filters as
        | IGetPaginatedParams
        | undefined,
  );
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);

  const filters = useMemo<IGetPaginatedParams>(
    () => storedFilters || { ...INITIAL_IMAGES_FILTERS, ...params },
    [params, storedFilters],
  );

  const setFilters = useCallback(
    (newFilters: IGetPaginatedParams) =>
      setFiltersGlobal(IMAGES_COMPONENT_FILTER_KEY, newFilters),
    [setFiltersGlobal],
  );

  const resetFilters = useCallback(
    () => resetFiltersGlobal(IMAGES_COMPONENT_FILTER_KEY, INITIAL_IMAGES_FILTERS),
    [resetFiltersGlobal],
  );

  const query = useQuery({
    queryKey: IMAGE_KEYS.list(filters),
    queryFn: () => ImageService.getAll(filters),
    placeholderData: (previousData: IGetAllImagesResponse | undefined) =>
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
