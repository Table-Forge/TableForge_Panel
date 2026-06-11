import { useState } from "react";
import { useController, type FieldValues } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { ButtonIcon } from "@/src/components/button-icon/button-icon";
import { sanitizePasswordValue } from "@/src/utils/custom-schema-validations";
import type { IControllerInput } from "./input.intefaces";
import { getInputClasses, inputInnerClasses } from "./input.styles";
import { ErrorMessage } from "@/src/components/error-message/error-message";

export function ControlledPasswordInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  hookForm,
  removeSpaces = false,
  sanitizePassword = false,
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
              onChange={(event) => {
                let inputValue = event.target.value;
                if (sanitizePassword) {
                  inputValue = sanitizePasswordValue(inputValue);
                } else if (removeSpaces) {
                  inputValue = inputValue.replace(/\s+/g, "");
                }
                onChange(inputValue);
              }}
              onBlur={onBlur}
              autoComplete="current-password"
              maxLength={100}
              className={`${inputInnerClasses} pr-11`}
            />
          )}
        </div>

        {!isLoading ? (
          <ButtonIcon
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            size="28px"
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-tertiary"
            style={{ position: "absolute" }}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </ButtonIcon>
        ) : null}
      </div>

      {error?.message ? <ErrorMessage>{error.message}</ErrorMessage> : null}
    </div>
  );
}
