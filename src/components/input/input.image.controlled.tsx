import { ImageInput } from "@/src/components/image-input/image-input";
import { ModalExistingImagePicker } from "@/src/components/modals/modal-existing-image-picker/modal-existing-image-picker";
import { useBoundStore } from "@/src/store";
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
  onClearImage,
  existingImagePicker,
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
  const openModal = useBoundStore((state) => state.openModal);

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
      onClear={() => {
        onChange("");
        onClearImage?.();
      }}
      extraActions={
        existingImagePicker ? (
          <button
            type="button"
            disabled={props.disabled || isLoading}
            onClick={() =>
              openModal(
                existingImagePicker.title ?? "Selecionar imagem existente",
                <ModalExistingImagePicker {...existingImagePicker} />,
                "md",
              )
            }
            className="inline-flex items-center rounded-lg border border-secondary/40 bg-secondary/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-secondary/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {existingImagePicker.buttonLabel ?? "Usar imagem existente"}
          </button>
        ) : null
      }
    />
  );
}
