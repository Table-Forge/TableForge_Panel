import { Button } from "@/src/components/button/button";
import { ImageInput } from "@/src/components/image-input/image-input";
import { ModalExistingImagePicker } from "@/src/components/modals/modal-existing-image-picker/modal-existing-image-picker";
import { useBoundStore } from "@/src/store";
import { useController, type FieldValues } from "react-hook-form";
import { isHttpUrl, isImageDataUrl } from "@/src/utils/image";
import { useEffect, useState } from "react";
import type { IControlledImageInput } from "./input.intefaces";

export function ControlledImageInput<
  TFieldValues extends FieldValues = FieldValues,
>({
  hookForm,
  name,
  previewValue,
  fallbackPreview,
  canChangeImage = true,
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
  const [ignoreExternalPreview, setIgnoreExternalPreview] = useState(false);

  const message = error ?? fieldError?.message;
  const fieldValue = typeof value === "string" ? value.trim() : "";
  const externalPreview = previewValue ?? fallbackPreview;

  useEffect(() => {
    setIgnoreExternalPreview(false);
  }, [externalPreview]);

  const resolvedValue = fieldValue
    ? isImageDataUrl(fieldValue) || isHttpUrl(fieldValue)
      ? fieldValue
      : externalPreview || fieldValue
    : ignoreExternalPreview
      ? ""
      : externalPreview;

  return (
    <ImageInput
      inputId={String(name)}
      value={resolvedValue}
      disabled={props.disabled || isLoading}
      canChangeImage={canChangeImage}
      error={message}
      onChange={(imageValue) => {
        setIgnoreExternalPreview(false);
        onChange(imageValue.content);
        onFileNameChange?.(imageValue.name);
      }}
      onClear={() => {
        setIgnoreExternalPreview(true);
        onChange("");
        onClearImage?.();
      }}
      extraActions={
        canChangeImage && existingImagePicker ? (
          <Button
            type="button"
            disabled={props.disabled || isLoading}
            onClick={() =>
              openModal(
                existingImagePicker.title ?? "Selecionar imagem existente",
                <ModalExistingImagePicker {...existingImagePicker} />,
                "md",
              )
            }
            buttonStyle="soft"
            size="xs"
          >
            {existingImagePicker.buttonLabel ?? "Usar imagem existente"}
          </Button>
        ) : null
      }
    />
  );
}
