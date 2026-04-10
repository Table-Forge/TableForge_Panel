import type { ReactNode } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type TPrimitives = string | number | boolean;

export interface TMultiSelectOption {
  value: TPrimitives;
  id?: string | number;
  name?: string;
  label?: ReactNode | string;
  allowSelect?: boolean;
}

export interface IMultiSelect<TFieldValues extends FieldValues = FieldValues> {
  initialOptions: TMultiSelectOption[];
  title: string;
  name: Path<TFieldValues>;
  hookForm: UseFormReturn<TFieldValues>;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
  mask?: string;
  allowNewOption?: boolean;
  allowSelectAll?: boolean;
  searchInput?: boolean;
  searchPlaceholder?: string;
  onChangeInputSearch?: (value: string) => void;
  isLoading?: boolean;
}
