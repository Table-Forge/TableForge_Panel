import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/src/context/auth";
import { AuthService } from "@/src/features/users/services/auth.services";
import { UserService } from "@/src/features/users/services/users.services";
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

  const loginMutation = useMutation({
    mutationFn: (credentials: ILoginRequest) => AuthService.login(credentials),
    onSuccess: async (data: ILoginResponse) => {
      await signIn(data);
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
