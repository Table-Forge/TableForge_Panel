import { UserService } from "@/src/features/users/services/users.services";
import { useQuery } from "@tanstack/react-query";
import { USER_KEYS } from "./query-key";
import type { IGetAllUsersResponse, IGetUsers } from "./types";

export function useUsers(params: IGetUsers = {}) {
  return useQuery({
    queryKey: USER_KEYS.list(params),
    queryFn: () => UserService.getAll(params),
    placeholderData: (previousData: IGetAllUsersResponse | undefined) =>
      previousData,
    enabled: params.enabled ?? true,
  });
}
