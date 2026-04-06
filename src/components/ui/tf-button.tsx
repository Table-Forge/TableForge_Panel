import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "sm" | "md" | "lg";

interface TFButtonProps
  extends PropsWithChildren,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  text?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClassMap: Record<ButtonVariant, string> = {
  primary: "border-secondary bg-primary text-white",
  secondary: "border-primary bg-secondary text-white",
  tertiary: "border-primary bg-tertiary text-white",
};

const sizeClassMap: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3 text-sm",
  md: "min-h-12 px-4 text-base",
  lg: "min-h-14 px-5 text-lg",
};

export function TFButton({
  text,
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className,
  type = "button",
  ...rest
}: TFButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        "inline-flex w-full items-center justify-center rounded-2xl border font-semibold uppercase tracking-wide transition",
        "active:scale-[0.98] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variantClassMap[variant],
        sizeClassMap[size],
        isDisabled ? "cursor-not-allowed bg-grays-100 text-white/65 opacity-75" : "",
        className ?? "",
      ].join(" ")}
      {...rest}
    >
      {isLoading ? "Carregando..." : text ?? children}
    </button>
  );
}
