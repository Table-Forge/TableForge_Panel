import {
  LoginResponseSchema,
  isAdminAuthType,
  type ILoginResponse,
} from "@/src/features/auth/schemas/auth.schema";
import type { AuthSlice, SliceCreator } from "@/src/store/types";

export const AUTH_STORAGE_KEY = "auth_data";

function parsePersistedAuth(value: string | null): ILoginResponse | null {
  if (!value) return null;

  try {
    const parsedJson: unknown = JSON.parse(value);
    const parsedAuth = LoginResponseSchema.safeParse(parsedJson);
    if (!parsedAuth.success) return null;

    const expTime = new Date(parsedAuth.data.token.expiration).getTime();
    if (!Number.isNaN(expTime) && expTime <= Date.now()) {
      return null;
    }

    if (!isAdminAuthType(parsedAuth.data.user?.type)) return null;

    return parsedAuth.data;
  } catch {
    return null;
  }
}

const initialAuth = parsePersistedAuth(
  typeof window !== "undefined" ? localStorage.getItem(AUTH_STORAGE_KEY) : null
);

export const createAuthSlice: SliceCreator<AuthSlice> = (set) => ({
  authData: initialAuth,
  isLoading: false,

  hydrateAuth: () => {
    const persistedAuth = parsePersistedAuth(
      localStorage.getItem(AUTH_STORAGE_KEY),
    );

    if (!persistedAuth) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    set({
      authData: persistedAuth,
      isLoading: false,
    });
  },

  signIn: (data) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    set({ authData: data, isLoading: false });
  },

  signOut: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    set({ authData: null, isLoading: false });
  },
});
