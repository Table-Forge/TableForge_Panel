import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  const err = error as {
    response?: { data?: { Message?: string; message?: string } };
    data?: { Message?: string; message?: string };
    Message?: string;
    message?: string;
  };

  const backendMessage =
    err?.response?.data?.Message ??
    err?.response?.data?.message ??
    err?.data?.Message ??
    err?.data?.message ??
    err?.Message;

  if (typeof backendMessage === "string" && backendMessage.trim()) {
    return backendMessage;
  }

  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
};

export const useAuthMutation = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const addToast = useBoundStore((state) => state.addToast);
  const setVerificationEmail = useBoundStore((state) => state.setVerificationEmail);

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
    onError: (error: unknown, variables) => {
      const message = getErrorMessage(error, "Não foi possível realizar o login.");

      if (message.includes("validar o seu e-mail")) {
        addToast("error", message);
        setVerificationEmail(variables.login);
        navigate("/verify-email");
        return;
      }

      addToast("error", message);
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

  const sendValidationCodeMutation = useMutation({
    mutationFn: (email: string) => AuthService.sendValidationCode(email),
    onError: (error: unknown) => {
      addToast(
        "error",
        getErrorMessage(error, "Não foi possível enviar o código."),
      );
    },
  });

  const validateEmailCodeMutation = useMutation({
    mutationFn: (params: TValidateRecoveryCodeParams) =>
      AuthService.validateEmailCode(params.email, params.code),
    onError: (error: unknown) => {
      addToast("error", getErrorMessage(error, "Código inválido."));
    },
  });

  return {
    loginMutation,
    isLoadingLoginMutation: loginMutation.isPending,
    sendRecoveryCodeMutation,
    validateRecoveryCodeMutation,
    updateRecoveryPasswordMutation,
    sendValidationCodeMutation,
    validateEmailCodeMutation,
  };
};

