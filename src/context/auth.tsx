import { useBoundStore } from "@/src/store/use-bound-store";
import { useEffect, type PropsWithChildren } from "react";

export function AuthProvider({ children }: PropsWithChildren) {
  const hydrateAuth = useBoundStore((state) => state.hydrateAuth);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  return children;
}
