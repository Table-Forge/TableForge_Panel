import { type ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { CampaignService } from "@/src/features/campaigns/services/campaigns.services";
import { useBoundStore } from "@/src/store/use-bound-store";
import { handleError } from "@/src/utils/error-handler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CAMPAIGN_KEYS } from "./query-key";

export const useCampaignsMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);

  const createMutation = useMutation({
    mutationFn: (data: ICampaign) => CampaignService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.lists() });
      addToast("success", "Campanha salva com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const updateMutation = useMutation({
    mutationFn: (data: ICampaign) => CampaignService.update(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: CAMPAIGN_KEYS.detail(variables.id),
        });
      }
      addToast("success", "Campanha editada com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => CampaignService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.details() });
      addToast("success", "Campanha removida com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const createOrUpdate = (data: ICampaign) => {
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
