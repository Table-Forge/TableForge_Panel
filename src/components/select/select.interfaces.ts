import type { ReactNode } from "react";
import type { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

export type TSelectValue = string | number | boolean | null | undefined;

export interface TSelectOptions {
  value: TSelectValue;
  id?: string | number;
  name?: string;
  label?: ReactNode | string;
  allowSelect?: boolean;
}

interface ISelect<TFieldValues extends FieldValues = FieldValues> {
  initialOptions: TSelectOptions[];
  title: string;
  disabled?: boolean;
  searchInput?: boolean;
  name: Path<TFieldValues>;
  required?: boolean;
  hookForm: UseFormReturn<TFieldValues>;
  className?: string;
  firstReset?: boolean;
  resetCallback?: () => void;
  error?: string;
  selected?: PathValue<TFieldValues, Path<TFieldValues>>;
  onChangeOption?: (item: TSelectOptions) => void;
  onChangeInputSearch?: (value: string) => void;
  isLoading?: boolean;
  searchPlaceholder?: string;
}

export type { ISelect };
