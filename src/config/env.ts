export type TEnvironment = "dev" | "prod" | "local";

const getEnvironment = (): TEnvironment => {
  const rawEnv = (
    import.meta.env.VITE_ENV ??
    import.meta.env.MODE ??
    "local"
  ).toString();

  const normalized = rawEnv.toLowerCase().trim();

  const ENV_MAP: Record<string, TEnvironment> = {
    development: "dev",
    production: "prod",
    local: "local",
    dev: "dev",
    prod: "prod",
  };

  return ENV_MAP[normalized] ?? "local";
};

const environment = getEnvironment();

const getApiUrl = () => {
  const sharedUrl = import.meta.env.VITE_API_URL as string | undefined;
  const devUrl = import.meta.env.VITE_API_DEVELOPMENT_URL as
    | string
    | undefined;
  const prodUrl = import.meta.env.VITE_API_PRODUCTION_URL as
    | string
    | undefined;

  if (environment === "prod") {
    return sharedUrl ?? prodUrl ?? devUrl ?? "";
  }

  return sharedUrl ?? devUrl ?? prodUrl ?? "";
};

export const ENV = {
  API_URL: getApiUrl(),
  ENVIRONMENT: environment,
};

if (!ENV.API_URL) {
  console.warn("API URL is not defined in environment variables.");
}
