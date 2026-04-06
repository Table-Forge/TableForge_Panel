import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface ICheckbox extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  infoText?: string;
}

interface ICheckboxControlled<TFieldValues extends FieldValues = FieldValues> {
  label?: string;
  disabled?: boolean;
  infoText?: string;
  name: Path<TFieldValues>;
  hookForm: UseFormReturn<TFieldValues, unknown, undefined>;
  defaultValue?: boolean;
}

interface ICheckboxStyles {
  disabled?: boolean;
  isHighlighted?: boolean;
}

export type { ICheckbox, ICheckboxControlled, ICheckboxStyles };
