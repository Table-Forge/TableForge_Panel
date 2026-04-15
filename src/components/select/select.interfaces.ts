import type { JSX } from "react";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";

type TPrimitives = string | number | boolean;

type TSelectOptions<TValue extends TPrimitives = TPrimitives> = {
  value: TValue | undefined | null;
  label?: string | JSX.Element;
  name: string;
  id?: number | string;
  allowSelect?: boolean;
};

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

export type { ISelect, TPrimitives, TSelectOptions };
