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
  aspectRatio?: number;
  cropShape?: "rect" | "round";
  enableCrop?: boolean;
  onChange: (value: IImageInputValue) => void;
  onClear?: () => void;
  extraActions?: ReactNode;
}
