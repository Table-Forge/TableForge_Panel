import { ErrorMessage } from "@/src/components/error-message/error-message";
import {
  formatToBRL,
  formatToFloat,
  formatToInteger,
  formatToPercentage,
} from "@/src/utils/format";
import { useEffect, useState } from "react";
import {
  useController,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form";
import type { INumberControllerInput } from "./input.intefaces";
import { getInputClasses, inputInnerClasses } from "./input.styles";

export function ControlledNumberInput<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  hookForm,
  format,
  onChangeValue,
  defaultValue,
  isLoading,
  ...props
}: INumberControllerInput<TFieldValues>) {
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({
    name,
    control: hookForm.control,
    defaultValue: (defaultValue ?? 0) as PathValue<
      TFieldValues,
      Path<TFieldValues>
    >,
  });

  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    const numeric = Number(value ?? 0);
    const valueByFormat: Record<string, string> = {
      currency: formatToBRL(numeric),
      percent: formatToPercentage(numeric),
      integer: formatToInteger(numeric),
      float: formatToFloat(numeric),
    };
    setDisplayValue(valueByFormat[format ?? ""] ?? numeric.toString());
  }, [format, value]);

  const handleChange = (inputValue: string) => {
    const clean = inputValue.replace(/[^\d]/g, "");
    if (!clean) {
      onChange(0);
      onChangeValue?.(0);
      return;
    }

    const finalValue =
      format === "integer"
        ? parseInt(clean, 10)
        : Number((Number(clean) / 100).toFixed(2));
    onChange(finalValue);
    onChangeValue?.(finalValue);
  };

  return (
    <div className="flex w-full flex-col gap-1">
      <div
        className={getInputClasses(error?.message, isLoading, props.disabled)}
      >
        {isLoading ? (
          <div className="px-3 text-xs text-grays-100">Carregando...</div>
        ) : (
          <input
            {...props}
            className={inputInnerClasses}
            value={displayValue}
            onChange={(event) => handleChange(event.target.value)}
            onBlur={onBlur}
          />
        )}
      </div>
      {error?.message ? <ErrorMessage>{error.message}</ErrorMessage> : null}
    </div>
  );
}
