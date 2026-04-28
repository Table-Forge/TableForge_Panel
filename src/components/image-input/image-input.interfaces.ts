import type { ReactNode } from "react";

export interface IImageInputValue {
  name: string;
  content: string;
  preview: string;
}

export interface IImageInput {
  label?: string;
  value?: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: IImageInputValue) => void;
  onClear?: () => void;
  extraActions?: ReactNode;
}
