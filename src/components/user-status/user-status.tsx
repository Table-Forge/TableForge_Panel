import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { normalizeString } from "@/src/utils/format";

interface UserStatusProps {
  value?: string | null;
  options?: TSelectOptions[];
  className?: string;
}

type StatusPresentation = {
  label: string;
  classes: string;
};

const STATUS_PRESENTATION: Record<string, StatusPresentation> = {
  active: {
    label: "Ativo",
    classes: "bg-green-500/10 text-green-400 border-green-500/30",
  },
  unverified: {
    label: "Não verificado",
    classes: "bg-amber-500/10 text-amber-300 border-amber-400/30",
  },
  blocked: {
    label: "Bloqueado",
    classes: "bg-danger/10 text-danger border-danger/30",
  },
  inactive: {
    label: "Inativo",
    classes: "bg-slate-400/10 text-slate-300 border-slate-300/30",
  },
  none: {
    label: "Nenhum",
    classes: "bg-secondary/10 text-secondary border-secondary/30",
  },
  deleted: {
    label: "Excluído",
    classes: "bg-zinc-500/10 text-zinc-300 border-zinc-400/30",
  },
  default: {
    label: "Indefinido",
    classes: "bg-secondary/10 text-secondary border-secondary/30",
  },
};

const STATUS_ALIASES: Record<string, string> = {
  active: "active",
  ativo: "active",
  unverified: "unverified",
  "nao verificado": "unverified",
  "não verificado": "unverified",
  blocked: "blocked",
  bloqueado: "blocked",
  inactive: "inactive",
  inativo: "inactive",
  none: "none",
  deleted: "deleted",
  deletado: "deleted",
};

const normalizeStatusValue = (value: unknown) =>
  normalizeString(String(value ?? ""))
    .trim()
    .toLowerCase();

const resolveStatusKey = (value: unknown) =>
  STATUS_ALIASES[normalizeStatusValue(value)] ?? normalizeStatusValue(value);

export const UserStatus = ({ value, options = [], className }: UserStatusProps) => {
  const statusKey = resolveStatusKey(value);
  const style = STATUS_PRESENTATION[statusKey] ?? STATUS_PRESENTATION.default;

  const option = options.find(
    (item) => resolveStatusKey(item.value) === statusKey,
  );

  const optionLabel =
    option?.name ??
    (typeof option?.label === "string" ? option.label : undefined);

  const fallbackLabel =
    typeof value === "string" && value.trim()
      ? value
      : STATUS_PRESENTATION.default.label;

  const label = optionLabel || style.label || fallbackLabel;

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${style.classes} ${className ?? ""}`}
    >
      {label}
    </span>
  );
};
