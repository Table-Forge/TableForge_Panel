import type { ICard, TCardCut, TCardPadding, TCardVariant } from "./card.interfaces";

const cutStyles: Record<TCardCut, string> = {
  sm: "chamfer-sm",
  md: "chamfer-md",
  lg: "chamfer-lg",
};

const paddingStyles: Record<TCardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
};

const surfaceStyles: Record<TCardVariant, string> = {
  default: "border-white/10 bg-card",
  surface: "border-white/10 bg-surface",
  highlighted: "border-ember/60 bg-card",
};

const bracketStyles =
  "before:pointer-events-none before:absolute before:bottom-2 before:left-2 before:h-3 before:w-3 before:border-b before:border-l before:transition-colors after:pointer-events-none after:absolute after:right-2 after:top-2 after:h-3 after:w-3 after:border-r after:border-t after:transition-colors";

const bracketTones: Record<TCardVariant, string> = {
  default: "before:border-white/20 after:border-white/20",
  surface: "before:border-white/20 after:border-white/20",
  highlighted: "before:border-ember after:border-ember",
};

const interactiveStyles =
  "transition-colors hover:border-ember/50 hover:before:border-ember hover:after:border-ember";

export function Card({
  as: Component = "div",
  variant = "default",
  padding = "md",
  cut = "md",
  brackets = true,
  interactive = false,
  className = "",
  children,
  ...props
}: ICard) {
  return (
    <Component
      className={[
        "relative border",
        cutStyles[cut],
        paddingStyles[padding],
        surfaceStyles[variant],
        brackets ? `${bracketStyles} ${bracketTones[variant]}` : "",
        interactive ? interactiveStyles : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}
