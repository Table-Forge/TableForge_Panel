import { useState } from "react";
import { useController, type FieldValues } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { ButtonIcon } from "@/src/components/button-icon/button-icon";
import { sanitizePasswordValue } from "@/src/utils/custom-schema-validations";
import type { IControllerInput } from "./input.intefaces";
import { getInputClasses, inputInnerClasses } from "./input.styles";
import { ErrorMessage } from "@/src/components/error-message/error-message";

export function PasswordInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  hookForm,
  isLoading,
  error,
  ...props
}: IControllerInput<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error: fieldError },
  } = useController({
    name,
    control: hookForm.control,
  });

  const message = error ?? fieldError?.message;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const filtered = sanitizePasswordValue(inputValue);
    onChange(filtered);
  };

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="relative w-full">
        <div className={getInputClasses(message, isLoading, props.disabled)}>
          {isLoading ? (
            <div className="px-3 text-xs text-grays-100">Carregando...</div>
          ) : (
            <input
              autoComplete="current-password"
              maxLength={100}
              {...props}
              id={name}
              ref={ref}
              value={(value ?? "") as string}
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
              onBlur={onBlur}
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

      {message ? <ErrorMessage>{message}</ErrorMessage> : null}
    </div>
  );
}
