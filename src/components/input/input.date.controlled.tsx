import { type FieldValues, useController } from "react-hook-form";
import { Calendar } from "lucide-react";
import type { IControlledDateInput } from "./input.intefaces";
import { getInputClasses, inputInnerClasses } from "./input.styles";
import { ErrorMessage } from "@/src/components/error-message/error-message";

function toInputDate(value: unknown) {
  if (!value) return "";
  const date = new Date(value as string | number | Date);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function DateInput<TFieldValues extends FieldValues>({
  hookForm,
  name,
  placeholder,
  disabled,
  isLoading,
  minDate,
  maxDate,
  className,
}: IControlledDateInput<TFieldValues>) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control: hookForm.control,
  });

  return (
    <div className={`flex w-full flex-col gap-1 ${className ?? ""}`}>
      <div className={getInputClasses(error?.message, isLoading, disabled)}>
        {isLoading ? (
          <div className="px-3 text-xs text-grays-100">Carregando...</div>
        ) : (
          <div className="relative flex h-full w-full items-center">
            <input
              type="date"
              disabled={disabled || isLoading}
              placeholder={placeholder}
              min={toInputDate(minDate)}
              max={toInputDate(maxDate)}
              value={toInputDate(value)}
              onChange={(event) => onChange(event.target.value || null)}
              className={`${inputInnerClasses} pr-11`}
            />
            <Calendar size={18} className="pointer-events-none absolute right-3 text-grays-100" />
          </div>
        )}
      </div>

      {error?.message ? <ErrorMessage>{error.message}</ErrorMessage> : null}
    </div>
  );
}

DateInput.displayName = "DateInput";
