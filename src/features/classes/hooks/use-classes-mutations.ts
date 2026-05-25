import type { IClass } from "@/src/features/classes/schemas/class.schema";
import { ClassService } from "@/src/features/classes/services/classes.services";
import { useBoundStore } from "@/src/store/use-bound-store";
import { handleError } from "@/src/utils/error-handler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CLASS_KEYS } from "./query-key";

export const useClassesMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);

  const createMutation = useMutation({
    mutationFn: (payload: IClass) => ClassService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_KEYS.lists() });
      addToast("success", "Classe salva com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: IClass) => ClassService.update(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CLASS_KEYS.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: CLASS_KEYS.detail(variables.id),
        });
      }
      addToast("success", "Classe editada com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ClassService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CLASS_KEYS.details() });
      addToast("success", "Classe removida com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const createOrUpdate = (data: IClass) => {
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
