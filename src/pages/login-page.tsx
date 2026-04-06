import { Shield } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BrandName } from "@/src/components/ui/brand-name";
import { TFButton } from "@/src/components/ui/tf-button";
import { TFInput } from "@/src/components/ui/tf-input";
import { useAuth } from "@/src/context/auth";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";

interface LoginLocationState {
  from?: { pathname?: string };
}

export function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginMutation, isLoadingLoginMutation } = useUsersMutation();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const redirectTo = useMemo(() => {
    const locationState = location.state as LoginLocationState | null;
    return locationState?.from?.pathname && locationState.from.pathname !== "/login"
      ? locationState.from.pathname
      : "/";
  }, [location.state]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate({ login, password });
  };

  const loginErrorMessage = loginMutation.error
    ? "Credenciais inválidas. Revise login e senha para continuar."
    : undefined;

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
            Identifique-se, aventureiro. Sua party te espera.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-5">
          <TFInput
            label="Usuário ou E-mail"
            placeholder="Seu nome de herói"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            autoComplete="username"
            required
          />

          <TFInput
            label="Segredo (Senha)"
            placeholder="Sua palavra-passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            isPassword
            autoComplete="current-password"
            required
            error={loginErrorMessage}
          />

          <TFButton type="submit" variant="tertiary" isLoading={isLoadingLoginMutation} text="Iniciar Jornada" />
        </form>
      </div>
    </main>
  );
}
