import { RaceService } from "@/src/features/races/services/races.services";
import { handleError } from "@/src/utils/error-handler";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { RACE_KEYS } from "./query-key";

export function useRaceById(id?: number) {
  const query = useQuery({
    queryKey: RACE_KEYS.detail(id),
    queryFn: () => RaceService.getById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (query.isError && !query.isFetching && query.error) {
      handleError(query.error);
    }
  }, [query.error, query.isError, query.isFetching]);

  return query;
}
