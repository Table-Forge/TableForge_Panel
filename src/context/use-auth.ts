import type { ILoginResponse } from "@/src/features/auth/schemas/auth.schema";
import { useBoundStore } from "@/src/store/use-bound-store";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();
  const authData = useBoundStore((state) => state.authData);
  const isLoading = useBoundStore((state) => state.isLoading);
  const signInStore = useBoundStore((state) => state.signIn);
  const signOutStore = useBoundStore((state) => state.signOut);

  const signIn = async (data: ILoginResponse) => {
    signInStore(data);
  };

  const signOut = async () => {
    signOutStore();
    queryClient.clear();
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

