import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { useMemo } from "react";
import { useAllGameSystems } from "./use-all-game-systems";
import type { IGetGameSystems } from "./types";

export const useGameSystemsSelect = ({
  enabled = true,
}: IGetGameSystems = {}) => {
  const gameSystemsQuery = useAllGameSystems({
    page: 1,
    size: 100,
    enabled,
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

  return {
    gameSystemOptions,
    isLoadingGameSystemsSelect: gameSystemsQuery.isPending,
    gameSystemsQuery,
  };
};
