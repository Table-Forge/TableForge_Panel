import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/src/context/auth";
import { AuthService } from "@/src/features/users/services/auth.services";
import { UserService } from "@/src/features/users/services/users.services";
import { useBoundStore } from "@/src/store/use-bound-store";
import type {
  ILoginRequest,
  ILoginResponse,
} from "@/src/features/users/schemas/auth.schema";
import type {
  IUpdatePassword,
  IUser,
  IUserUpdateOutput,
} from "@/src/features/users/schemas/user.schema";

export const useUsersMutation = () => {
  const { signIn } = useAuth();
  const addToast = useBoundStore((state) => state.addToast);

  const loginMutation = useMutation({
    mutationFn: (credentials: ILoginRequest) => AuthService.login(credentials),
    onSuccess: async (data: ILoginResponse) => {
      await signIn(data);
      addToast("success", "Login realizado com sucesso.");
    },
    onError: (error: unknown) => {
      const fallback = "Não foi possível realizar o login.";
      const message =
        error instanceof Error ? error.message || fallback : fallback;
      addToast("error", message);
    },
  });

  const newUserMutation = useMutation({
    mutationFn: (data: IUser) => UserService.create(data),
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: IUserUpdateOutput) => UserService.update(data),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: IUpdatePassword) => UserService.updatePassword(data),
  });

  return {
    loginMutation,
    isLoadingLoginMutation: loginMutation.isPending,
    newUserMutation,
    isLoadingNewUserMutation: newUserMutation.isPending,
    updatePasswordMutation,
    isUpdatingPassword: updatePasswordMutation.isPending,
    updateUserMutation,
    isUpdatingUser: updateUserMutation.isPending,
  };
};
