import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventService } from "../services/events.services";
import { EVENT_KEYS } from "./query-key";
import { useBoundStore } from "@/src/store";
import { handleError } from "@/src/utils/error-handler";

export const useEventMutations = () => {
  const queryClient = useQueryClient();
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);

  const createMutation = useMutation({
    mutationFn: EventService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_KEYS.all });
      addToast("success", "Evento criado com sucesso.");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof EventService.update>[1] }) => EventService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: EVENT_KEYS.byId(variables.id) });
      queryClient.invalidateQueries({ queryKey: EVENT_KEYS.all });
      addToast("success", "Evento atualizado com sucesso.");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const deleteMutation = useMutation({
    mutationFn: EventService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_KEYS.all });
      addToast("success", "Evento cancelado com sucesso. Participantes notificados.");
    },
    onError: (error: Error) => handleError(error),
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
