import { ErrorMessage } from "@/src/components/error-message/error-message";
import { useController, type FieldValues } from "react-hook-form";
import type { IControllerInput } from "./input.intefaces";
import { getInputClasses, inputInnerClasses } from "./input.styles";

export function ControlledInput<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  hookForm,
  sanitize,
  sanitizeEmail,
  uppercase = false,
  removeSpaces = false,
  isLoading,
  ...props
}: IControllerInput<TFieldValues>) {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error },
  } = useController({
    name,
    control: hookForm.control,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;

    if (sanitize) inputValue = inputValue.replace(/[^A-Za-z0-9\s]/g, "");
    if (sanitizeEmail)
      inputValue = inputValue.replace(/[^\w.@+-]/g, "").replace(/\s+/g, "");
    if (removeSpaces) inputValue = inputValue.replace(/\s+/g, "");
    if (uppercase) inputValue = inputValue.toUpperCase();

    onChange(inputValue);
  };

  const errorMessage = props.error || error?.message;

  return (
    <div className="flex w-full flex-col gap-1">
      <div
        className={getInputClasses(errorMessage, isLoading, props.disabled)}
      >
        {isLoading ? (
          <div className="px-3 text-xs text-grays-100">Carregando...</div>
        ) : (
          <input
            {...props}
            id={name}
            ref={ref}
            value={(value ?? "") as string}
            onChange={handleChange}
            onBlur={onBlur}
            className={`${inputInnerClasses} ${uppercase ? "uppercase" : ""}`}
          />
        )}
      </div>
      {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
    </div>
  );
}
