import { type IImage } from "@/src/features/images/schemas/image.schema";
import { ImageService } from "@/src/features/images/services/images.services";
import { useBoundStore } from "@/src/store/use-bound-store";
import { handleError } from "@/src/utils/error-handler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IMAGE, IMAGE_LIST, IMAGE_UUID } from "./query-key";

export const useImagesMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);

  const createMutation = useMutation({
    mutationFn: (payload: IImage) => ImageService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [IMAGE_LIST] });
      addToast("success", "Imagem criada com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: IImage) => ImageService.update(payload),
    onSuccess: (_image, variables) => {
      queryClient.invalidateQueries({ queryKey: [IMAGE_LIST] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: [IMAGE, variables.id] });
      }
      addToast("success", "Imagem atualizada com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ImageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [IMAGE_LIST] });
      queryClient.invalidateQueries({ queryKey: [IMAGE] });
      queryClient.invalidateQueries({ queryKey: [IMAGE_UUID] });
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
