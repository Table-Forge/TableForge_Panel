import { ImageInput } from "@/src/components/image-input/image-input";
import { useController, type FieldValues } from "react-hook-form";
import { isHttpUrl, isImageDataUrl } from "@/src/utils/image";
import type { IControlledImageInput } from "./input.intefaces";

export function ControlledImageInput<
  TFieldValues extends FieldValues = FieldValues,
>({
  hookForm,
  name,
  label,
  previewValue,
  fallbackPreview,
  onFileNameChange,
  error,
  isLoading,
  ...props
}: IControlledImageInput<TFieldValues>) {
  const {
    field: { value, onChange },
    fieldState: { error: fieldError },
  } = useController({
    name,
    control: hookForm.control,
  });

  const message = error ?? fieldError?.message;
  const fieldValue = typeof value === "string" ? value.trim() : "";
  const externalPreview = previewValue ?? fallbackPreview;

  const resolvedValue = fieldValue
    ? isImageDataUrl(fieldValue) || isHttpUrl(fieldValue)
      ? fieldValue
      : externalPreview || fieldValue
    : externalPreview;

  return (
    <ImageInput
      label={label}
      value={resolvedValue}
      disabled={props.disabled || isLoading}
      error={message}
      onChange={(imageValue) => {
        onChange(imageValue.content);
        onFileNameChange?.(imageValue.name);
      }}
      onClear={() => onChange("")}
    />
  );
}
