import { forwardRef, useEffect, useState } from "react";
import { ErrorMessage } from "@/src/components/error-message/error-message";
import type { ITextarea } from "./input.intefaces";
import {
  getTextareaClasses,
  textareaCounterClasses,
  textareaInnerClasses,
} from "./input.styles";

const getTextareaValueLength = (value: unknown) => {
  if (value === null || value === undefined) return 0;
  if (Array.isArray(value)) return value.join("").length;
  return String(value).length;
};

export const Textarea = forwardRef<HTMLTextAreaElement, ITextarea>(
  (
    {
      sanitize,
      sanitizeEmail,
      uppercase = false,
      removeSpaces = false,
      isLoading,
      error,
      disabled,
      wrapperClassName,
      className,
      onChange,
      ...props
    },
    ref,
  ) => {
    const hasCounter = typeof props.maxLength === "number";
    const [currentLength, setCurrentLength] = useState(() =>
      getTextareaValueLength(props.value ?? props.defaultValue),
    );

    useEffect(() => {
      if (props.value !== undefined) {
        setCurrentLength(getTextareaValueLength(props.value));
      }
    }, [props.value]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      let inputValue = event.target.value;

      if (sanitize) inputValue = inputValue.replace(/[^A-Za-z0-9\s]/g, "");
      if (sanitizeEmail)
        inputValue = inputValue.replace(/[^\w.@+-]/g, "").replace(/\s+/g, "");
      if (removeSpaces) inputValue = inputValue.replace(/\s+/g, "");
      if (uppercase) inputValue = inputValue.toUpperCase();

      if (inputValue !== event.target.value) {
        event.target.value = inputValue;
      }

      setCurrentLength(inputValue.length);
      onChange?.(event);
    };

    return (
      <div className={`flex w-full flex-col gap-1 ${wrapperClassName ?? ""}`}>
        <div className={getTextareaClasses(error, isLoading, disabled)}>
          {isLoading ? (
            <div className="px-3 py-3 text-xs text-grays-100">
              Carregando...
            </div>
          ) : (
            <textarea
              {...props}
              ref={ref}
              disabled={disabled}
              onChange={handleChange}
              className={`${textareaInnerClasses} ${hasCounter ? "pb-6" : ""} ${uppercase ? "uppercase" : ""} ${className ?? ""}`}
            />
          )}

          {!isLoading && hasCounter ? (
            <span className={textareaCounterClasses}>
              {currentLength}/{props.maxLength} caracteres
            </span>
          ) : null}
        </div>

        {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
