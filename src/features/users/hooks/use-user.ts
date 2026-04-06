import { useQuery } from "@tanstack/react-query";
import { USER } from "@/src/features/users/hooks/query-key";
import { UserService } from "@/src/features/users/services/users.services";

export function useUser(id?: number) {
  return useQuery({
    queryKey: [USER, id],
    queryFn: async () => {
      if (id === undefined) throw new Error("ID is required");
      return UserService.getById(id);
    },
    enabled: id !== undefined && !Number.isNaN(id),
    staleTime: 1000 * 60 * 5,
  });
}
