import { ClassService } from "@/src/features/classes/services/classes.services";
import { handleError } from "@/src/utils/error-handler";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { CLASS_KEYS } from "./query-key";

export function useClassById(id?: number) {
  const query = useQuery({
    queryKey: CLASS_KEYS.detail(id),
    queryFn: () => ClassService.getById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (query.isError && !query.isFetching && query.error) {
      handleError(query.error);
    }
  }, [query.error, query.isError, query.isFetching]);

  return query;
}
