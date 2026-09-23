import { KeystoneIcon } from "@/src/components/icons/icons";
import type { IForgeKicker } from "./forge-kicker.interfaces";

export function ForgeKicker({ children, className = "" }: IForgeKicker) {
  return (
    <p
      className={`inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-ember ${className}`}
    >
      <KeystoneIcon className="h-3 w-3 shrink-0 text-accent" aria-hidden="true" />
      <span>{children}</span>
      <span className="h-px w-10 shrink-0 bg-accent/40" aria-hidden="true" />
    </p>
  );
}
