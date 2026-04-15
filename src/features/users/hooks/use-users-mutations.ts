import type {
  IUpdatePassword,
  IUser,
} from "@/src/features/users/schemas/user.schema";
import { UserService } from "@/src/features/users/services/users.services";
import { useBoundStore } from "@/src/store/use-bound-store";
import { handleError } from "@/src/utils/error-handler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USER_KEYS } from "./query-key";

export const useUsersMutation = () => {
  const queryClient = useQueryClient();

  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);

  const createMutation = useMutation({
    mutationFn: (data: IUser) => UserService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      addToast("success", "Usuário salvo com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const updateMutation = useMutation({
    mutationFn: (data: IUser) => UserService.update(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.detail(variables.id) });
      addToast("success", "Usuário editado com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => UserService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      addToast("success", "Usuário removido com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  const createOrUpdate = (data: IUser) => {
    if (data.id) {
      return updateMutation.mutate(data);
    }
    return createMutation.mutate(data);
  };

  const updatePasswordMutation = useMutation({
    mutationFn: (data: IUpdatePassword) => {
      return UserService.updatePassword(data);
    },
    onSuccess: () => {
      addToast("success", "Senha alterada com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    createOrUpdate,
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,

    updatePasswordMutation,
    isUpdatingPassword: updatePasswordMutation.isPending,
  };
};
