import type { ReactNode } from "react";

export interface IImageInputValue {
  name: string;
  content: string;
  preview: string;
}

export interface IImageInput {
  inputId?: string;
  value?: string;
  disabled?: boolean;
  canChangeImage?: boolean;
  error?: string;
  maxSizeBytes?: number;
  acceptedTypes?: string[];
  onChange: (value: IImageInputValue) => void;
  onClear?: () => void;
  extraActions?: ReactNode;
}
