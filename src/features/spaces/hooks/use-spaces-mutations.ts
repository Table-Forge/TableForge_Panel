import { handleError } from "@/src/utils/error-handler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SpaceService } from "../services/spaces.services";
import { SPACE_KEYS } from "./query-key";
import { useBoundStore } from "@/src/store";

export const useSpaceMutations = () => {
  const queryClient = useQueryClient();
  const addToast = useBoundStore((state) => state.addToast);

  const createSpaceMutation = useMutation({
    mutationFn: SpaceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.all });
      addToast("success", "Espaço criado com sucesso!");
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });

  const updateSpaceMutation = useMutation({
    mutationFn: SpaceService.update,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.lists() });
      addToast("success", "Espaço atualizado com sucesso!");
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });

  const deleteSpaceMutation = useMutation({
    mutationFn: SpaceService.delete,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.lists() });
      addToast("success", "Espaço removido com sucesso!");
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });

  const addImageMutation = useMutation({
    mutationFn: SpaceService.addImage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.detail(variables.spaceId) });
      addToast("success", "Imagem adicionada à galeria!");
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });

  const removeImageMutation = useMutation({
    mutationFn: SpaceService.removeImage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.detail(variables.spaceId) });
      addToast("success", "Imagem removida da galeria!");
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });

  return {
    createSpaceMutation,
    isCreatingSpace: createSpaceMutation.isPending,
    updateSpaceMutation,
    isUpdatingSpace: updateSpaceMutation.isPending,
    deleteSpaceMutation,
    isDeletingSpace: deleteSpaceMutation.isPending,
    addImageMutation,
    isAddingImage: addImageMutation.isPending,
    removeImageMutation,
    isRemovingImage: removeImageMutation.isPending,
  };
};

export const useSpaceTableMutations = () => {
  const queryClient = useQueryClient();
  const addToast = useBoundStore((state) => state.addToast);

  const createTableMutation = useMutation({
    mutationFn: SpaceService.createTable,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.tables(variables.spaceId) });
      addToast("success", "Mesa criada com sucesso!");
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });

  const updateTableMutation = useMutation({
    mutationFn: SpaceService.updateTable,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.table(variables.id) });
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.all });
      addToast("success", "Mesa atualizada com sucesso!");
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });

  const deleteTableMutation = useMutation({
    mutationFn: SpaceService.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.all });
      addToast("success", "Mesa desativada com sucesso!");
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });

  return {
    createTableMutation,
    isCreatingTable: createTableMutation.isPending,
    updateTableMutation,
    isUpdatingTable: updateTableMutation.isPending,
    deleteTableMutation,
    isDeletingTable: deleteTableMutation.isPending,
  };
};

export const useSpaceBookingMutations = () => {
  const queryClient = useQueryClient();
  const addToast = useBoundStore((state) => state.addToast);

  const updateStatusMutation = useMutation({
    mutationFn: SpaceService.updateBookingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.bookingLists() });
      addToast("success", "Status do agendamento atualizado com sucesso!");
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: SpaceService.sendBookingMessage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.bookingMessages(variables.bookingId) });
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });

  return {
    updateStatusMutation,
    isUpdatingStatus: updateStatusMutation.isPending,
    sendMessageMutation,
    isSendingMessage: sendMessageMutation.isPending,
  };
};

