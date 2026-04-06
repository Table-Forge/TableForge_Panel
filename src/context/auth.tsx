import { useEffect, type PropsWithChildren } from "react";
import type { ILoginResponse } from "@/src/features/users/schemas/auth.schema";
import { useBoundStore } from "@/src/store/use-bound-store";
import { AUTH_STORAGE_KEY } from "@/src/store/slices/auth-slice";

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
