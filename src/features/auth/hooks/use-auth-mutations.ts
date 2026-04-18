import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/src/context/use-auth";
import type {
  ILoginRequest,
  ILoginResponse,
} from "@/src/features/auth/schemas/auth.schema";
import { isAdminAuthType } from "@/src/features/auth/schemas/auth.schema";
import { AuthService } from "@/src/features/auth/services/auth.services";
import { useBoundStore } from "@/src/store/use-bound-store";

type TValidateRecoveryCodeParams = {
  email: string;
  code: string;
};

type TUpdateRecoveryPasswordParams = {
  email: string;
  code: string;
  newPassword: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
};

export const useAuthMutation = () => {
  const { signIn } = useAuth();
  const addToast = useBoundStore((state) => state.addToast);

  const loginMutation = useMutation({
    mutationFn: async (credentials: ILoginRequest) => {
      const data = await AuthService.login(credentials);

      if (!isAdminAuthType(data.user?.type)) {
        throw new Error("Acesso permitido apenas para usuários Admin.");
      }

      return data;
    },
    onSuccess: async (data: ILoginResponse) => {
      await signIn(data);
      addToast("success", "Login realizado com sucesso.");
    },
    onError: (error: unknown) => {
      addToast(
        "error",
        getErrorMessage(error, "Não foi possível realizar o login."),
      );
    },
  });

  const sendRecoveryCodeMutation = useMutation({
    mutationFn: (email: string) => AuthService.sendRecoveryCode(email),
    onError: (error: unknown) => {
      addToast(
        "error",
        getErrorMessage(error, "Não foi possível enviar o código."),
      );
    },
  });

  const validateRecoveryCodeMutation = useMutation({
    mutationFn: (params: TValidateRecoveryCodeParams) =>
      AuthService.validateRecoveryCode(params.email, params.code),
    onError: (error: unknown) => {
      addToast("error", getErrorMessage(error, "Código inválido."));
    },
  });

  const updateRecoveryPasswordMutation = useMutation({
    mutationFn: (params: TUpdateRecoveryPasswordParams) =>
      AuthService.updateRecoveryPassword(
        params.email,
        params.code,
        params.newPassword,
      ),
    onError: (error: unknown) => {
      addToast(
        "error",
        getErrorMessage(error, "Não foi possível atualizar sua senha."),
      );
    },
  });

  return {
    loginMutation,
    isLoadingLoginMutation: loginMutation.isPending,
    sendRecoveryCodeMutation,
    validateRecoveryCodeMutation,
    updateRecoveryPasswordMutation,
  };
};

