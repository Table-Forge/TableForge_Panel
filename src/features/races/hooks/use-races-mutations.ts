import type { IRace } from "@/src/features/races/schemas/race.schema";
import { RaceService } from "@/src/features/races/services/races.services";
import { useBoundStore } from "@/src/store/use-bound-store";
import { handleError } from "@/src/utils/error-handler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RACE_KEYS } from "./query-key";

export const useRacesMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);

  const createMutation = useMutation({
    mutationFn: (payload: IRace) => RaceService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RACE_KEYS.lists() });
      addToast("success", "Raça salva com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: IRace) => RaceService.update(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: RACE_KEYS.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: RACE_KEYS.detail(variables.id),
        });
      }
      addToast("success", "Raça editada com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => RaceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RACE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: RACE_KEYS.details() });
      addToast("success", "Raça removida com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const createOrUpdate = (data: IRace) => {
    if (data.id) {
      return updateMutation.mutate(data);
    }
    return createMutation.mutate(data);
  };

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    createOrUpdate,
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};
