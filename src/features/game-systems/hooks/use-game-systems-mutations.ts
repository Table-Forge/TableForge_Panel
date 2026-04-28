import { type IGameSystem } from "@/src/features/game-systems/schemas/game-system.schema";
import { GameSystemService } from "@/src/features/game-systems/services/game-systems.services";
import { useBoundStore } from "@/src/store/use-bound-store";
import { handleError } from "@/src/utils/error-handler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GAME_SYSTEM_KEYS } from "./query-key";

export const useGameSystemsMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);

  const createMutation = useMutation({
    mutationFn: (payload: IGameSystem) => GameSystemService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GAME_SYSTEM_KEYS.lists() });
      addToast("success", "Sistema de jogo salvo com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: IGameSystem) => GameSystemService.update(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: GAME_SYSTEM_KEYS.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: GAME_SYSTEM_KEYS.detail(variables.id),
        });
      }
      addToast("success", "Sistema de jogo editado com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => GameSystemService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GAME_SYSTEM_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: GAME_SYSTEM_KEYS.details() });
      addToast("success", "Sistema de jogo removido com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const createOrUpdate = (data: IGameSystem) => {
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
