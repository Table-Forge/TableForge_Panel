import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import type { IImage } from "@/src/features/images/schemas/image.schema";

export interface IInputStyles {
  error?: string;
  isLoading?: boolean;
  disabled?: boolean;
  uppercase?: boolean;
  removeSpaces?: boolean;
}

export interface IControllerInput<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">,
    IInputStyles {
  hookForm: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  sanitize?: boolean;
  sanitizeEmail?: boolean;
}

export interface IMaskedControllerInput<TFieldValues extends FieldValues = FieldValues>
  extends IControllerInput<TFieldValues> {
  mask: string;
}

export interface INumberControllerInput<TFieldValues extends FieldValues = FieldValues>
  extends IControllerInput<TFieldValues> {
  format?: "currency" | "percent" | "integer" | "float";
  onChangeValue?: (value: number) => void;
  defaultValue?: string | number;
}

export interface IControlledDateInput<TFieldValues extends FieldValues = FieldValues>
  extends IControllerInput<TFieldValues> {
  minDate?: string | Date;
  maxDate?: string | Date;
  showYearDropdown?: boolean;
  showTime?: boolean;
  startDate?: string | Date;
  endDate?: string | Date;
  selectsStart?: boolean;
  selectsEnd?: boolean;
}

export interface IMaskedInput extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
  error?: string;
  isLoading?: boolean;
}

export interface IInput extends React.InputHTMLAttributes<HTMLInputElement>, IInputStyles {
  sanitize?: boolean;
  sanitizeEmail?: boolean;
  wrapperClassName?: string;
}

export interface ITextarea
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    IInputStyles {
  sanitize?: boolean;
  sanitizeEmail?: boolean;
  wrapperClassName?: string;
}

export interface IControllerTextarea<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name">,
    IInputStyles {
  hookForm: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  sanitize?: boolean;
  sanitizeEmail?: boolean;
}

export interface IControlledConfirmationInput<TFieldValues extends FieldValues = FieldValues>
  extends IControllerInput<TFieldValues> {
  label?: string;
}

export interface IControlledImageInput<TFieldValues extends FieldValues = FieldValues>
  extends IControllerInput<TFieldValues> {
  previewValue?: string;
  fallbackPreview?: string;
  canChangeImage?: boolean;
  onFileNameChange?: (name: string) => void;
  onClearImage?: () => void;
  existingImagePicker?: {
    buttonLabel?: string;
    emptyMessage?: string;
    imageType?: IImage["type"];
    onSelect: (image: IImage) => void;
    searchPlaceholder?: string;
    selectedImageId?: number;
    selectedImageUrl?: string;
    title?: string;
  };
}

export type TConfirmationStatus = "idle" | "editando" | "confirmando" | "errado" | "ok";
