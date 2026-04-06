import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import {
  LoginResponseSchema,
  type ILoginResponse,
} from "@/src/features/users/schemas/auth.schema";

const AUTH_STORAGE_KEY = "auth_data";

interface IAuthContext {
  authData: ILoginResponse | null;
  user: ILoginResponse["user"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (data: ILoginResponse) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | null>(null);

function parsePersistedAuth(value: string | null): ILoginResponse | null {
  if (!value) return null;

  try {
    const parsedJson: unknown = JSON.parse(value);
    const parsedAuth = LoginResponseSchema.safeParse(parsedJson);

    if (!parsedAuth.success) return null;

    const isTokenExpired = parsedAuth.data.token.expiration.getTime() <= Date.now();
    if (isTokenExpired) return null;

    return parsedAuth.data;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [authData, setAuthData] = useState<ILoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const persistedAuth = parsePersistedAuth(localStorage.getItem(AUTH_STORAGE_KEY));

    if (!persistedAuth) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    setAuthData(persistedAuth);
    setIsLoading(false);
  }, []);

  const signIn = useCallback(async (data: ILoginResponse) => {
    setAuthData(data);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  }, []);

  const signOut = useCallback(async () => {
    setAuthData(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const value = useMemo<IAuthContext>(
    () => ({
      authData,
      user: authData?.user ?? null,
      isAuthenticated: Boolean(authData),
      isLoading,
      signIn,
      signOut,
    }),
    [authData, isLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export { AUTH_STORAGE_KEY };
