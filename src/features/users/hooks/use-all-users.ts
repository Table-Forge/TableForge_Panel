import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import type { IGetPaginatedParams } from "@/src/interfaces";
import { INITIAL_PAGINATE } from "@/src/constants/paginate";
import { useComponentStore } from "@/src/store";
import { UserService } from "@/src/features/users/services/users.services";
import { USER_KEYS } from "./query-key";
import type { IGetAllUsersResponse, IGetUsers } from "./types";

export const USERS_COMPONENT_FILTER_KEY = "users";

export const INITIAL_USERS_FILTERS: IGetPaginatedParams = {
  ...INITIAL_PAGINATE,
  search: "",
};

export function useAllUsers(params?: IGetUsers) {
  const storedFilters = useComponentStore(
    (state) =>
      state.states[USERS_COMPONENT_FILTER_KEY]?.filters as
        | IGetPaginatedParams
        | undefined,
  );
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);

  const filters = useMemo<IGetPaginatedParams>(
    () => storedFilters || { ...INITIAL_USERS_FILTERS, ...params },
    [params, storedFilters],
  );

  const setFilters = useCallback(
    (newFilters: IGetPaginatedParams) =>
      setFiltersGlobal(USERS_COMPONENT_FILTER_KEY, newFilters),
    [setFiltersGlobal],
  );

  const resetFilters = useCallback(
    () => resetFiltersGlobal(USERS_COMPONENT_FILTER_KEY, INITIAL_USERS_FILTERS),
    [resetFiltersGlobal],
  );

  const query = useQuery({
    queryKey: USER_KEYS.list(filters),
    queryFn: () => UserService.getAll(filters),
    placeholderData: (previousData: IGetAllUsersResponse | undefined) =>
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
