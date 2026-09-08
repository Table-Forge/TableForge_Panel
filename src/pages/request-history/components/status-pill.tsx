interface IStatusPill {
  statusCode?: number;
}

const getStatusClasses = (statusCode?: number) => {
  if (!statusCode) return "border-white/15 bg-white/10 text-grays-100";
  if (statusCode >= 500) return "border-red-500/30 bg-red-500/20 text-red-300";
  if (statusCode >= 400)
    return "border-amber-500/30 bg-amber-500/20 text-amber-300";
  if (statusCode >= 300) return "border-white/15 bg-white/10 text-grays-100";
  return "border-emerald-500/30 bg-emerald-500/20 text-emerald-300";
};

export function StatusPill({ statusCode }: IStatusPill) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-extrabold tracking-wide ${getStatusClasses(
        statusCode,
      )}`}
    >
      {statusCode ?? "-"}
    </span>
  );
}
