import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { normalizeString } from "@/src/utils/format";

interface TermsStatusBadgeProps {
  value?: string | null;
  options?: TSelectOptions[];
  className?: string;
}

const STATUS_PRESENTATION: Record<string, { label: string; classes: string }> = {
  pendingapproval: {
    label: "Aguardando aprovação",
    classes: "bg-amber-500/10 text-amber-300 border-amber-400/30",
  },
  active: {
    label: "Ativo",
    classes: "bg-green-500/10 text-green-400 border-green-500/30",
  },
  deprecated: {
    label: "Depreciado",
    classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
  },
  default: {
    label: "Indefinido",
    classes: "bg-secondary/10 text-secondary border-secondary/30",
  },
};

const normalizeKey = (val?: unknown) =>
  normalizeString(String(val ?? ""))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export const TermsStatusBadge = ({
  value,
  options = [],
  className = "",
}: TermsStatusBadgeProps) => {
  const key = normalizeKey(value);
  const presentation = STATUS_PRESENTATION[key] ?? STATUS_PRESENTATION.default;

  const option = options.find((opt) => normalizeKey(opt.value) === key);
  const label =
    option?.name ??
    (typeof option?.label === "string" ? option.label : presentation.label);

  return (
    <span
      className={`rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${presentation.classes} ${className}`}
    >
      {label}
    </span>
  );
};
