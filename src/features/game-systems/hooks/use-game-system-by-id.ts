import { GameSystemService } from "@/src/features/game-systems/services/game-systems.services";
import { handleError } from "@/src/utils/error-handler";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { GAME_SYSTEM_KEYS } from "./query-key";

export function useGameSystemById(id?: number) {
  const query = useQuery({
    queryKey: GAME_SYSTEM_KEYS.detail(id),
    queryFn: () => GameSystemService.getById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (query.isError && !query.isFetching && query.error) {
      handleError(query.error);
    }
  }, [query.isError, query.isFetching]);

  return query;
}
