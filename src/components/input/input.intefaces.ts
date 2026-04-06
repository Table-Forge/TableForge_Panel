import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export interface IInputStyles {
  error?: string;
  isLoading?: boolean;
  disabled?: boolean;
  uppercase?: boolean;
}

export interface IControllerInput<TFieldValues extends FieldValues = FieldValues>
  extends IInputStyles {
  hookForm: UseFormReturn<TFieldValues, unknown, undefined>;
  name: Path<TFieldValues>;
  placeholder?: string;
  maxLength?: number;
  sanitize?: boolean;
  sanitizeEmail?: boolean;
  className?: string;
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

export interface IControlledConfirmationInput<TFieldValues extends FieldValues = FieldValues>
  extends IControllerInput<TFieldValues> {
  label?: string;
}

export type TConfirmationStatus = "idle" | "editando" | "confirmando" | "errado" | "ok";
