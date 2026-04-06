import type { TPrimitives, TSelectOptions } from "../types/global.types";

export const mapToSelectOptions = <T, K extends keyof T>(
  data: T[] | undefined,
  labelKey: keyof T,
  valueKey: K = "id" as K
): TSelectOptions<T[K] & TPrimitives>[] => {
  if (!data || !Array.isArray(data)) return [];

  return data
    .filter((item) => item[valueKey] !== undefined && item[valueKey] !== null)
    .map((item) => {
      const value = item[valueKey] as T[K] & TPrimitives;
      const label = String(item[labelKey]);

      return {
        id: value as unknown as string | number,
        value: value,
        label: label,
        name: label,
      };
    });
};
