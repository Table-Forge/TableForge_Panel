export const getInputClasses = (
  error?: string,
  isLoading?: boolean,
  disabled?: boolean,
) => {
  const base =
    "flex h-12 w-full min-w-[80px] items-center overflow-hidden rounded-2xl border bg-transparent transition";
  const border = error
    ? "border-danger focus-within:ring-2 focus-within:ring-danger/20"
    : "border-white/35 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/25";
  const state =
    disabled || isLoading
      ? "cursor-not-allowed bg-white/5 opacity-70"
      : "hover:border-white/55";

  return `${base} ${border} ${state}`;
};

export const inputInnerClasses =
  "h-full w-full border-none bg-transparent px-3 py-2 text-sm font-medium text-white placeholder:font-normal placeholder:text-white/35 focus:outline-none disabled:cursor-not-allowed";

export const getTextareaClasses = (
  error?: string,
  isLoading?: boolean,
  disabled?: boolean,
) => {
  const base =
    "relative flex min-h-28 max-h-40 w-full min-w-[80px] items-start overflow-hidden rounded-2xl border bg-transparent transition";
  const border = error
    ? "border-danger focus-within:ring-2 focus-within:ring-danger/20"
    : "border-white/35 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/25";
  const state =
    disabled || isLoading
      ? "cursor-not-allowed bg-white/5 opacity-70"
      : "hover:border-white/55";

  return `${base} ${border} ${state}`;
};

export const textareaInnerClasses =
  "h-32 max-h-40 w-full resize-none overflow-y-auto border-none bg-transparent px-3 py-2.5 text-sm font-medium leading-5 text-white placeholder:font-normal placeholder:text-white/35 focus:outline-none disabled:cursor-not-allowed";

export const textareaCounterClasses =
  "pointer-events-none absolute bottom-1.5 right-3 text-[10px] font-medium text-grays-100";
