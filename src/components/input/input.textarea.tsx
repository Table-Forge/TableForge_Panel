import { forwardRef } from "react";
import { ErrorMessage } from "@/src/components/error-message/error-message";
import type { ITextarea } from "./input.intefaces";
import { getTextareaClasses, textareaInnerClasses } from "./input.styles";

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
              className={`${textareaInnerClasses} ${uppercase ? "uppercase" : ""} ${className ?? ""}`}
            />
          )}
        </div>

        {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
