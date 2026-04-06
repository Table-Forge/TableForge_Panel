export type ButtonStyles = "primary" | "secondary" | "danger" | "hollow";

export interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  maxWidth?: boolean;
  isLoading?: boolean;
  buttonStyle?: ButtonStyles;
  color?: string;
}
