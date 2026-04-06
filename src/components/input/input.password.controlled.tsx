import { useState } from "react";
import { useController, type FieldValues } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import type { IControllerInput } from "./input.intefaces";
import { getInputClasses, inputInnerClasses } from "./input.styles";
import { ErrorMessage } from "@/src/components/error-message/error-message";

export function ControlledPasswordInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  hookForm,
  isLoading,
  ...props
}: IControllerInput<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error },
  } = useController({
    name,
    control: hookForm.control,
  });

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="relative w-full">
        <div className={getInputClasses(error?.message, isLoading, props.disabled)}>
          {isLoading ? (
            <div className="px-3 text-xs text-grays-100">Carregando...</div>
          ) : (
            <input
              {...props}
              id={name}
              ref={ref}
              type={showPassword ? "text" : "password"}
              value={(value ?? "") as string}
              onChange={(event) => onChange(event.target.value)}
              onBlur={onBlur}
              autoComplete="current-password"
              maxLength={100}
              className={`${inputInnerClasses} pr-11`}
            />
          )}
        </div>

        {!isLoading ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-grays-100 transition hover:text-tertiary"
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        ) : null}
      </div>

      {error?.message ? <ErrorMessage>{error.message}</ErrorMessage> : null}
    </div>
  );
}
