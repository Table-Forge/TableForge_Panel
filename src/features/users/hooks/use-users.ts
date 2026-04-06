import { useQuery } from "@tanstack/react-query";
import { USERS } from "@/src/features/users/hooks/query-key";
import { UserService } from "@/src/features/users/services/users.services";

export function useUsers() {
  return useQuery({
    queryKey: [USERS],
    queryFn: () => UserService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}
