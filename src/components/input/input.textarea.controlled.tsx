import { ErrorMessage } from "@/src/components/error-message/error-message";
import { useController, type FieldValues } from "react-hook-form";
import type { IControllerTextarea } from "./input.intefaces";
import {
  getTextareaClasses,
  textareaCounterClasses,
  textareaInnerClasses,
} from "./input.styles";

export function ControlledTextarea<
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
}: IControllerTextarea<TFieldValues>) {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error },
  } = useController({
    name,
    control: hookForm.control,
  });
  const hasCounter = typeof props.maxLength === "number";
  const currentLength = String(value ?? "").length;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let inputValue = event.target.value;

    if (sanitize) inputValue = inputValue.replace(/[^A-Za-z0-9\s]/g, "");
    if (sanitizeEmail)
      inputValue = inputValue.replace(/[^\w.@+-]/g, "").replace(/\s+/g, "");
    if (removeSpaces) inputValue = inputValue.replace(/\s+/g, "");
    if (uppercase) inputValue = inputValue.toUpperCase();

    onChange(inputValue);
  };

  return (
    <div className="flex w-full flex-col gap-1">
      <div
        className={getTextareaClasses(
          error?.message,
          isLoading,
          props.disabled,
        )}
      >
        {isLoading ? (
          <div className="px-3 py-3 text-xs text-grays-100">
            Carregando...
          </div>
        ) : (
          <textarea
            {...props}
            id={name}
            ref={ref}
            value={(value ?? "") as string}
            onChange={handleChange}
            onBlur={onBlur}
            className={`${textareaInnerClasses} ${hasCounter ? "pb-6" : ""} ${uppercase ? "uppercase" : ""} ${props.className ?? ""}`}
          />
        )}

        {!isLoading && hasCounter ? (
          <span className={textareaCounterClasses}>
            {currentLength}/{props.maxLength} caracteres
          </span>
        ) : null}
      </div>
      {error?.message ? <ErrorMessage>{error.message}</ErrorMessage> : null}
    </div>
  );
}
