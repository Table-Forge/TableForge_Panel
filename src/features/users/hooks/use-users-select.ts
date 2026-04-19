import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { useMemo, useState } from "react";
import { useAllUsers } from "./use-all-users";

interface IUseUsersSelectProps {
  enabled?: boolean;
  size?: number;
}

const DEFAULT_SIZE = 50;

export const useUsersSelect = ({
  enabled = true,
  size = DEFAULT_SIZE,
}: IUseUsersSelectProps = {}) => {
  const [search, setSearch] = useState("");

  const usersQuery = useAllUsers({
    page: 1,
    size,
    search,
    enabled,
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

  return {
    userOptions,
    isLoadingUsersSelect: usersQuery.isPending,
    onSearchUsers: (value: string) => setSearch(value.trim()),
    usersQuery,
  };
};

