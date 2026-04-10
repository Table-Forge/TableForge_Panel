import type { IButton } from "./button.intefaces";

function Loading() {
  return (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
  );
}

export const Button: React.FC<IButton> = ({
  children,
  buttonStyle = "primary",
  size = "md",
  isLoading,
  maxWidth,
  color,
  className = "",
  disabled,
  style,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-2xl border text-xs font-bold uppercase tracking-wider transition";

  const widthStyles = maxWidth ? "w-full" : "w-max";
  const sizeStyles: Record<NonNullable<IButton["size"]>, string> = {
    xs: "h-8 px-3",
    sm: "h-10 px-4",
    md: "h-12 px-5",
    lg: "h-14 px-6",
    xl: "h-16 px-7",
  };

  const variants: Record<NonNullable<IButton["buttonStyle"]>, string> = {
    primary: "bg-secondary border-secondary text-white hover:brightness-110",
    secondary: "bg-tertiary border-tertiary text-white hover:brightness-110",
    danger: "bg-danger border-danger text-white hover:brightness-110",
    hollow: "bg-transparent border-secondary text-secondary hover:bg-secondary/10",
  };

  const interactionStyles =
    disabled || isLoading
      ? "cursor-not-allowed opacity-60"
      : "cursor-pointer active:scale-[0.98]";

  const hollowInlineStyle =
    buttonStyle === "hollow"
      ? {
          borderColor: color || undefined,
          color: color || undefined,
        }
      : {};

  return (
    <button
      className={[
        baseStyles,
        widthStyles,
        sizeStyles[size],
        variants[buttonStyle],
        interactionStyles,
        className,
      ].join(" ")}
      disabled={disabled || isLoading}
      style={{ ...style, ...hollowInlineStyle }}
      {...props}
    >
      {isLoading ? (
        <>
          <Loading />
          Carregando...
        </>
      ) : (
        children
      )}
    </button>
  );
};
