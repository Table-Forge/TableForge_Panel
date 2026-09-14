import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { INITIAL_PAGINATE } from "@/src/constants/paginate";
import { useComponentStore } from "@/src/store";
import { useDebouncedCallback } from "@/src/hooks/utils/useDebouncedCallback";
import { UserFeedbackService } from "../services/user-feedbacks.services";
import { USER_FEEDBACKS_KEYS } from "./query-keys";
import type { IUserFeedbackFilters, IUserFeedbackListDto } from "../interfaces";
import { UserFeedbackStatus } from "../enums";
import type { IPaginatedResponse } from "@/src/interfaces";

export const USER_FEEDBACKS_COMPONENT_FILTER_KEY = "user-feedbacks";

export const INITIAL_USER_FEEDBACKS_FILTERS: IUserFeedbackFilters = {
  ...INITIAL_PAGINATE,
  search: "",
  status: UserFeedbackStatus.New,
};

const SEARCH_DEBOUNCE_MS = 500;

export function useAllUserFeedbacks(params?: IUserFeedbackFilters) {
  const storedFilters = useComponentStore(
    (state) =>
      state.states[USER_FEEDBACKS_COMPONENT_FILTER_KEY]?.filters as
        | IUserFeedbackFilters
        | undefined,
  );
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);

  const filters = useMemo<IUserFeedbackFilters>(
    () => storedFilters || { ...INITIAL_USER_FEEDBACKS_FILTERS, ...params },
    [params, storedFilters],
  );

  const setFilters = useCallback(
    (newFilters: IUserFeedbackFilters) =>
      setFiltersGlobal(USER_FEEDBACKS_COMPONENT_FILTER_KEY, newFilters),
    [setFiltersGlobal],
  );

  const resetFilters = useCallback(
    () =>
      resetFiltersGlobal(
        USER_FEEDBACKS_COMPONENT_FILTER_KEY,
        INITIAL_USER_FEEDBACKS_FILTERS,
      ),
    [resetFiltersGlobal],
  );

  const query = useQuery({
    queryKey: USER_FEEDBACKS_KEYS.list(filters),
    queryFn: () => UserFeedbackService.getAll(filters),
    placeholderData: (previousData: IPaginatedResponse<IUserFeedbackListDto> | undefined) =>
      previousData,
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
