import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { GameSystemService } from "@/src/features/game-systems/services/game-systems.services";
import { useDebouncedCallback } from "@/src/hooks/utils/useDebouncedCallback";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { GAME_SYSTEM_KEYS } from "./query-key";
import type { IGetAllGameSystemsResponse, IGetGameSystems } from "./types";

const DEFAULT_SIZE = 100;
const SEARCH_DEBOUNCE_MS = 500;
const SELECT_STALE_TIME_MS = 1000 * 60 * 30;

export const useGameSystemsSelect = ({
  enabled = true,
}: IGetGameSystems = {}) => {
  const [search, setSearch] = useState("");

  const filters = { page: 1, size: DEFAULT_SIZE, search };

  const gameSystemsQuery = useQuery({
    queryKey: GAME_SYSTEM_KEYS.list(filters),
    queryFn: () => GameSystemService.getAll(filters),
    placeholderData: (previousData: IGetAllGameSystemsResponse | undefined) =>
      previousData,
    enabled,
    staleTime: SELECT_STALE_TIME_MS,
  });

  const gameSystemOptions = useMemo<TSelectOptions[]>(
    () =>
      (gameSystemsQuery.data?.items ?? []).map((gameSystem) => ({
        value: gameSystem.id,
        id: gameSystem.id,
        name: gameSystem.name || `Sistema ${gameSystem.id ?? ""}`,
      })),
    [gameSystemsQuery.data?.items],
  );

  const onSearchGameSystems = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
  }, SEARCH_DEBOUNCE_MS);

  return {
    gameSystemOptions,
    isLoadingGameSystemsSelect: gameSystemsQuery.isPending,
    onSearchGameSystems,
    gameSystemsQuery,
  };
};
