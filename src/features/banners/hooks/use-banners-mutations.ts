import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BannersService } from "../services/banners.services";
import type { IBanner, IBannerCreate } from "../schemas/banner.schema";
import { useBoundStore } from "@/src/store";

export const useBannersMutation = () => {
  const queryClient = useQueryClient();
  const closeModal = useBoundStore((state) => state.closeModal);
  const addToast = useBoundStore((state) => state.addToast);

  const createMutation = useMutation({
    mutationFn: (payload: IBannerCreate) => BannersService.create(payload),
    onSuccess: () => {
      addToast("success", "Banner criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      closeModal();
    },
    onError: () => {
      addToast("error", "Erro ao criar o banner.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<IBannerCreate> & { id: number }) =>
      BannersService.update(payload),
    onSuccess: () => {
      addToast("success", "Banner atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      closeModal();
    },
    onError: () => {
      addToast("error", "Erro ao atualizar o banner.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => BannersService.delete(id),
    onSuccess: () => {
      addToast("success", "Banner excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      closeModal();
    },
    onError: () => {
      addToast("error", "Erro ao excluir o banner.");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (banners: IBanner[]) => {
      const updates = banners.map((banner, index) => {
        const newOrder = index + 1;
        if (banner.id && banner.order !== newOrder) {
          return BannersService.update({
            id: banner.id,
            order: newOrder,
            title: banner.title,
            description: banner.description,
            tag: banner.tag,
            link: banner.link,
            imageId: banner.imageId,
          });
        }
        return Promise.resolve();
      });
      await Promise.all(updates);
    },
    onSuccess: () => {
      addToast("success", "Ordem dos banners atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: () => {
      addToast("error", "Erro ao atualizar a ordem dos banners.");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    reorderMutation,
  };
};

