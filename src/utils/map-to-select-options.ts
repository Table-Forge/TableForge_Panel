import type { TSelectOptions } from "../components";
import type { TPrimitives } from "../types/global.types";

type TMapToSelectOptionsParams<T, K extends keyof T> = {
  data: T[] | undefined;
  labelKey: keyof T;
  valueKey?: K;
  // When true, remove items with `allowSelect === false`.
  filterAllowed?: boolean;
  // When true, force value as string.
  stringifyValue?: boolean;
};

type TWithAllowSelect = {
  allowSelect?: boolean;
};

export function mapToSelectOptions<T, K extends keyof T>(
  params: TMapToSelectOptionsParams<T, K> & { stringifyValue: true },
): TSelectOptions<string>[];
export function mapToSelectOptions<T, K extends keyof T>(
  params: TMapToSelectOptionsParams<T, K>,
): TSelectOptions<T[K] & TPrimitives>[];
export function mapToSelectOptions<T, K extends keyof T>({
  data,
  labelKey,
  valueKey = "id" as K,
  filterAllowed = true,
  stringifyValue = false,
}: TMapToSelectOptionsParams<T, K>): TSelectOptions<
  (T[K] & TPrimitives) | string
>[] {
  if (!data || !Array.isArray(data)) return [];

  return data
    .filter((item) => {
      const hasValue = item[valueKey] !== undefined && item[valueKey] !== null;
      const allowSelect = (item as T & TWithAllowSelect).allowSelect;

      const isAllowed = filterAllowed ? allowSelect !== false : true;

      return hasValue && isAllowed;
    })
    .map((item) => {
      const value = stringifyValue
        ? String(item[valueKey])
        : (item[valueKey] as T[K] & TPrimitives);
      const label = String(item[labelKey]);
      const allowSelect = (item as T & TWithAllowSelect).allowSelect;

      return {
        id: value as unknown as string | number,
        value,
        label,
        name: label,
        allowSelect,
      };
    });
}
