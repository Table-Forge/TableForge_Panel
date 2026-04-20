import { ENV } from "@/src/config/env";
import type { TEnvironment } from "@/src/config/env";

const envColorClass: Partial<Record<TEnvironment, string>> = {
  dev: "bg-danger",
  local: "bg-tertiary",
};

export const EnvFlag = () => {
  const environment = ENV.ENVIRONMENT;

  if (!environment || environment === "prod") return null;

  return (
    <div
      className={`pointer-events-none fixed top-3 -right-10 z-[1000] flex w-[140px] rotate-45 items-center justify-center px-0 py-1 text-center text-[11px] font-bold uppercase tracking-wide text-white shadow-md ${envColorClass[environment] ?? "bg-primary"}`}
    >
      {environment}
    </div>
  );
};
