import { type IImage } from "@/src/features/images/schemas/image.schema";
import { ImageService } from "@/src/features/images/services/images.services";
import { useBoundStore } from "@/src/store/use-bound-store";
import { handleError } from "@/src/utils/error-handler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IMAGE_KEYS } from "./query-key";

export const useImagesMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);

  const createMutation = useMutation({
    mutationFn: (payload: IImage) => ImageService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.lists() });
      addToast("success", "Imagem criada com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: IImage) => ImageService.update(payload),
    onSuccess: (_image, variables) => {
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: IMAGE_KEYS.detail(variables.id),
        });
      }
      addToast("success", "Imagem atualizada com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ImageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.details() });
      addToast("success", "Imagem removida com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const createOrUpdate = async (data: IImage): Promise<string> => {
    if (data.id) {
      return updateMutation.mutateAsync(data);
    }
    return createMutation.mutateAsync(data);
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
