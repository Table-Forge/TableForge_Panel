import type { ITag } from "./tag.interfaces";

export const Tag = ({ label, color }: ITag) => {
  if (!color) {
    return (
      <span className="inline-flex items-center justify-center whitespace-nowrap shrink-0 chamfer-sm border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
        {label}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center whitespace-nowrap shrink-0 chamfer-sm border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em]"
      style={{
        color,
        backgroundColor: `${color}20`,
        borderColor: `${color}60`,
      }}
    >
      {label}
    </span>
  );
};
