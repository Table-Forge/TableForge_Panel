import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { UserService } from "@/src/features/users/services/users.services";
import { useDebouncedCallback } from "@/src/hooks/utils/useDebouncedCallback";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { USER_KEYS } from "./query-key";
import type { IGetAllUsersResponse } from "./types";

interface IUseUsersSelectProps {
  enabled?: boolean;
  size?: number;
}

const DEFAULT_SIZE = 50;
const SEARCH_DEBOUNCE_MS = 500;
const SELECT_STALE_TIME_MS = 1000 * 60 * 30;

export const useUsersSelect = ({
  enabled = true,
  size = DEFAULT_SIZE,
}: IUseUsersSelectProps = {}) => {
  const [search, setSearch] = useState("");

  const filters = { page: 1, size, search };

  const usersQuery = useQuery({
    queryKey: USER_KEYS.list(filters),
    queryFn: () => UserService.getAll(filters),
    placeholderData: (previousData: IGetAllUsersResponse | undefined) =>
      previousData,
    enabled,
    staleTime: SELECT_STALE_TIME_MS,
  });

  const userOptions = useMemo<TSelectOptions[]>(
    () =>
      (usersQuery.data?.items ?? [])
        .filter((user) => typeof user.id === "number")
        .map((user) => ({
          id: user.id!,
          value: user.id!,
          name:
            user.nickname ||
            user.username ||
            user.email ||
            `Usuário ${user.id}`,
        })),
    [usersQuery.data?.items],
  );

  const onSearchUsers = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
  }, SEARCH_DEBOUNCE_MS);

  return {
    userOptions,
    isLoadingUsersSelect: usersQuery.isPending,
    onSearchUsers,
    usersQuery,
  };
};
