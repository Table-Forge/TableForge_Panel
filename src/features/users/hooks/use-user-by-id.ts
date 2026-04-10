import { handleError } from "@/src/utils/error-handler";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { UserService } from "../services/users.services";
import { USER } from "./query-key";

export function useUserById(id?: number) {
  const query = useQuery({
    queryKey: [USER, id],
    queryFn: () => UserService.getById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (query.isError && !query.isFetching && query.error) {
      handleError(query.error);
    }
  }, [query.isError, query.isFetching]);

  return query;
}
