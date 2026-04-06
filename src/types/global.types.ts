export type TPrimitives = string | number | boolean | null | undefined;

export interface TSelectOptions<TValue extends TPrimitives = TPrimitives> {
  id?: string | number;
  value: TValue;
  label?: string;
  name: string;
}

export interface TMultiSelectOption<TValue extends TPrimitives = TPrimitives> {
  value: TValue;
  name: string;
  label?: string;
}
