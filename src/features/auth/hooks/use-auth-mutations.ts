import { useAuth } from "@/src/context/auth";
import type {
  ILoginRequest,
  ILoginResponse,
} from "@/src/features/auth/schemas/auth.schema";
import { AuthService } from "@/src/features/auth/services/auth.services";
import { useBoundStore } from "@/src/store/use-bound-store";
import { useMutation } from "@tanstack/react-query";

export const useAuthMutation = () => {
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

  return {
    loginMutation,
    isLoadingLoginMutation: loginMutation.isPending,
  };
};
