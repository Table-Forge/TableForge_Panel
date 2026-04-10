import type { ReactNode } from "react";

export interface IMoreOptions {
  label: string;
  icon?: ReactNode;
  show?: boolean;
  onClick: () => void;
}
