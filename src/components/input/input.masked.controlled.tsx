import { useController, type FieldValues } from "react-hook-form";
import type { IMaskedControllerInput } from "./input.intefaces";
import { ErrorMessage } from "@/src/components/error-message/error-message";
import { getInputClasses, inputInnerClasses } from "./input.styles";

function applyMask(value: string, mask: string) {
  const digits = value.replace(/\D/g, "");
  let result = "";
  let digitIndex = 0;

  for (let i = 0; i < mask.length; i += 1) {
    if (mask[i] === "9") {
      if (digitIndex >= digits.length) break;
      result += digits[digitIndex];
      digitIndex += 1;
    } else {
      result += mask[i];
    }
  }

  return result;
}

export function ControlledMaskedInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  hookForm,
  mask,
  isLoading,
  ...props
}: IMaskedControllerInput<TFieldValues>) {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error },
  } = useController({
    name,
    control: hookForm.control,
  });

  return (
    <div className="flex w-full flex-col gap-1">
      <div className={getInputClasses(error?.message, isLoading, props.disabled)}>
        {isLoading ? (
          <div className="px-3 text-xs text-grays-100">Carregando...</div>
        ) : (
          <input
            {...props}
            id={name}
            ref={ref}
            value={applyMask(String(value ?? ""), mask)}
            onChange={(event) => onChange(applyMask(event.target.value, mask))}
            onBlur={onBlur}
            className={inputInnerClasses}
            type="text"
          />
        )}
      </div>
      {error?.message ? <ErrorMessage>{error.message}</ErrorMessage> : null}
    </div>
  );
}
