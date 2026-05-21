export type ButtonStyles =
  | "primary"
  | "secondary"
  | "danger"
  | "hollow"
  | "soft"
  | "softDanger";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  maxWidth?: boolean;
  isLoading?: boolean;
  buttonStyle?: ButtonStyles;
  size?: ButtonSize;
  color?: string;
}
