import { D20Icon } from "@/src/components/icons/icons";
import type { IButton } from "./button.intefaces";

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
    "inline-flex items-center justify-center gap-2 border font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";

  const widthStyles = maxWidth ? "w-full" : "w-max";
  const sizeStyles: Record<NonNullable<IButton["size"]>, string> = {
    xs: "h-7 px-2.5 text-xs chamfer-sm",
    sm: "h-8 px-3 text-xs chamfer-sm",
    md: "h-10 px-4 text-sm chamfer-sm",
    lg: "h-11 px-5 text-sm font-semibold chamfer-sm",
    xl: "h-12 px-6 text-base font-semibold chamfer-md",
  };

  const variants: Record<NonNullable<IButton["buttonStyle"]>, string> = {
    primary:
      "bg-secondary border-secondary text-on-accent shadow-forged hover:brightness-110",
    secondary:
      "bg-tertiary border-tertiary text-on-accent shadow-forged hover:brightness-110",
    danger:
      "bg-danger border-danger text-on-accent shadow-forged hover:brightness-110",
    hollow:
      "bg-transparent border-secondary text-secondary hover:bg-secondary/10",
    soft:
      "border-secondary/40 bg-secondary/15 text-white hover:bg-secondary/25",
    softDanger:
      "border-danger/40 bg-danger/10 text-danger hover:bg-danger/20",
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
          <D20Icon className="h-4 w-4 animate-spin" aria-hidden="true" />
          Carregando...
        </>
      ) : (
        children
      )}
    </button>
  );
};
