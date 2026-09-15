import type { ITag } from "./tag.interfaces";

export const Tag = ({ label, color }: ITag) => {
  if (!color) {
    return (
      <span className="inline-flex items-center justify-center whitespace-nowrap rounded border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-bold uppercase text-white/80">
        {label}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center whitespace-nowrap rounded border px-2.5 py-1 text-[11px] font-bold uppercase"
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
