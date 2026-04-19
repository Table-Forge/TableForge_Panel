import { zodResolver } from "@hookform/resolvers/zod";
import { Shield } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/src/components/button/button";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { ControlledPasswordInput } from "@/src/components/input/input.password.controlled";
import { BrandName } from "@/src/components/ui/brand-name";
import { useAuth } from "@/src/context/use-auth";
import { useAuthMutation } from "@/src/features/auth/hooks/use-auth-mutations";
import {
  LoginRequestSchema,
  type ILoginRequest,
} from "@/src/features/auth/schemas/auth.schema";
import { Label } from "@/src/components/label/label";

interface LoginLocationState {
  from?: { pathname?: string };
}

export function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginMutation, isLoadingLoginMutation } = useAuthMutation();

  const form = useForm<ILoginRequest, unknown, ILoginRequest>({
    resolver: zodResolver(LoginRequestSchema) as Resolver<
      ILoginRequest,
      unknown,
      ILoginRequest
    >,
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const { handleSubmit } = form;

  const redirectTo = useMemo(() => {
    const locationState = location.state as LoginLocationState | null;
    return locationState?.from?.pathname &&
      locationState.from.pathname !== "/login"
      ? locationState.from.pathname
      : "/";
  }, [location.state]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values);
  });

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(126,135,226,0.28),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(251,69,1,0.24),transparent_46%)]" />

      <div className="relative w-full max-w-md rounded-3xl border border-secondary/25 bg-primary/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur">
        <header className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-tertiary bg-primary shadow-[0_0_20px_rgba(251,69,1,0.35)]">
            <Shield className="text-tertiary" size={44} />
          </div>

          <BrandName />
          <p className="mt-2 max-w-[260px] text-center text-sm text-grays-100">
            Acesse o painel administrativo do TableForge.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-5">
          <InputGroup>
            <Label htmlFor="login">Usuário ou e-mail</Label>

            <ControlledInput<ILoginRequest>
              hookForm={form}
              name="login"
              placeholder="Digite seu usuário ou e-mail"
              autoComplete="username"
              removeSpaces
              maxLength={100}
              disabled={isLoadingLoginMutation}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Senha</Label>

            <ControlledPasswordInput<ILoginRequest>
              hookForm={form}
              name="password"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              removeSpaces
              maxLength={100}
              disabled={isLoadingLoginMutation}
            />
          </InputGroup>

          <div className="flex justify-end">
            <Link
              to="/recover-password"
              className="text-xs font-semibold text-secondary transition hover:brightness-110"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          <Button
            type="submit"
            buttonStyle="secondary"
            maxWidth
            isLoading={isLoadingLoginMutation}
          >
            Entrar no painel
          </Button>
        </form>
      </div>
    </main>
  );
}
