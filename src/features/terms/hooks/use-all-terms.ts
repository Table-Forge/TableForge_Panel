import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { INITIAL_PAGINATE } from "@/src/constants/paginate";
import { useComponentStore } from "@/src/store";
import { TermsService, type IGetTermsParams } from "@/src/features/terms/services/terms.services";
import { useDebouncedCallback } from "@/src/hooks/utils/useDebouncedCallback";
import { TERMS_KEYS } from "./query-key";
import { type IPaginatedResponse } from "@/src/interfaces";
import { type ITermsDocumentList } from "../schemas/terms.schema";

export const TERMS_COMPONENT_FILTER_KEY = "terms";

export const INITIAL_TERMS_FILTERS: IGetTermsParams = {
  ...INITIAL_PAGINATE,
  search: "",
  audience: "",
  status: "",
};

const SEARCH_DEBOUNCE_MS = 500;

export function useAllTerms(params?: IGetTermsParams) {
  const storedFilters = useComponentStore(
    (state) =>
      state.states[TERMS_COMPONENT_FILTER_KEY]?.filters as
        | IGetTermsParams
        | undefined,
  );
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);

  const filters = useMemo<IGetTermsParams>(
    () => storedFilters || { ...INITIAL_TERMS_FILTERS, ...params },
    [params, storedFilters],
  );

  const setFilters = useCallback(
    (newFilters: IGetTermsParams) =>
      setFiltersGlobal(TERMS_COMPONENT_FILTER_KEY, newFilters),
    [setFiltersGlobal],
  );

  const resetFilters = useCallback(
    () => resetFiltersGlobal(TERMS_COMPONENT_FILTER_KEY, INITIAL_TERMS_FILTERS),
    [resetFiltersGlobal],
  );

  const query = useQuery({
    queryKey: TERMS_KEYS.list(filters as Record<string, unknown>),
    queryFn: () => TermsService.getPaginated(filters),
    placeholderData: (
      previousData: IPaginatedResponse<ITermsDocumentList> | undefined,
    ) => previousData,
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
