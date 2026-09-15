import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TermsService } from "../services/terms.services";
import { TERMS_KEYS } from "./query-key";
import { useBoundStore } from "@/src/store";
import { handleError } from "@/src/utils/error-handler";

export const useTermsMutations = () => {
  const queryClient = useQueryClient();
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);

  const createMutation = useMutation({
    mutationFn: TermsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TERMS_KEYS.all });
      addToast("success", "Contrato cadastrado com sucesso.");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      TermsService.update(id, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TERMS_KEYS.byId(variables.id) });
      queryClient.invalidateQueries({ queryKey: TERMS_KEYS.all });
      addToast("success", "Contrato atualizado com sucesso.");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => TermsService.approve(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: TERMS_KEYS.byId(id) });
      queryClient.invalidateQueries({ queryKey: TERMS_KEYS.all });
      addToast("success", "Contrato aprovado e colocado em vigor.");
    },
    onError: (error: Error) => handleError(error),
  });

  const deprecateMutation = useMutation({
    mutationFn: (id: number) => TermsService.deprecate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: TERMS_KEYS.byId(id) });
      queryClient.invalidateQueries({ queryKey: TERMS_KEYS.all });
      addToast("success", "Contrato depreciado com sucesso.");
    },
    onError: (error: Error) => handleError(error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => TermsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TERMS_KEYS.all });
      addToast("success", "Contrato excluído com sucesso.");
    },
    onError: (error: Error) => handleError(error),
  });

  return {
    createMutation,
    updateMutation,
    approveMutation,
    deprecateMutation,
    deleteMutation,
  };
};
