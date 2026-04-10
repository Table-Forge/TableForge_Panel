import type { ILoginResponse } from "@/src/features/auth/schemas/auth.schema";
import { AUTH_STORAGE_KEY } from "@/src/store/slices/auth-slice";
import { useBoundStore } from "@/src/store/use-bound-store";
import { useEffect, type PropsWithChildren } from "react";

export function AuthProvider({ children }: PropsWithChildren) {
  const hydrateAuth = useBoundStore((state) => state.hydrateAuth);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  return children;
}

export function useAuth() {
  const authData = useBoundStore((state) => state.authData);
  const isLoading = useBoundStore((state) => state.isLoading);
  const signInStore = useBoundStore((state) => state.signIn);
  const signOutStore = useBoundStore((state) => state.signOut);

  const signIn = async (data: ILoginResponse) => {
    signInStore(data);
  };

  const signOut = async () => {
    signOutStore();
  };

  return {
    authData,
    user: authData?.user ?? null,
    isAuthenticated: Boolean(authData),
    isLoading,
    signIn,
    signOut,
  };
}

export { AUTH_STORAGE_KEY };
