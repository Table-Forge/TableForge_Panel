import { Button } from "@/src/components/button/button";
import { ImagePlus, Trash2 } from "lucide-react";
import { useId, useRef, useState } from "react";
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  toImageSource,
  validateImageFile,
} from "@/src/utils/image";
import type { IImageInput } from "./image-input.interfaces";

export const ImageInput: React.FC<IImageInput> = ({
  inputId,
  value,
  disabled,
  canChangeImage = true,
  error,
  maxSizeBytes = MAX_IMAGE_SIZE_BYTES,
  acceptedTypes = ACCEPTED_IMAGE_MIME_TYPES,
  onChange,
  onClear,
  extraActions,
}) => {
  const fallbackInputId = useId();
  const resolvedInputId = inputId ?? fallbackInputId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);

  const previewSource = toImageSource(value);

  const handleOpenFileSelector = () => {
    if (disabled || !canChangeImage) return;
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file, {
      maxSize: maxSizeBytes,
      acceptedTypes,
    });

    if (validationError) {
      setSelectionError(validationError);
      event.target.value = "";
      return;
    }

    setSelectionError(null);

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      if (!result) return;

      onChange({
        name: file.name,
        content: result,
        preview: result,
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-primary/60 p-3">
        <button
          type="button"
          onClick={handleOpenFileSelector}
          disabled={disabled}
          className={`group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-background/70 transition disabled:cursor-not-allowed disabled:opacity-60 ${
            canChangeImage ? "hover:border-secondary/50" : "cursor-default"
          }`}
        >
          {previewSource ? (
            <img
              src={previewSource}
              alt="Prévia da imagem"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlus size={20} className="text-grays-100 group-hover:text-white" />
          )}
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="truncate text-xs text-grays-100">
            {previewSource ? "Imagem selecionada" : "Nenhuma imagem selecionada"}
          </p>

          <div className="flex flex-wrap gap-2">
            {canChangeImage ? (
              <Button
                type="button"
                onClick={handleOpenFileSelector}
                disabled={disabled}
                buttonStyle="soft"
                size="xs"
              >
                {previewSource ? "Trocar imagem" : "Selecionar imagem"}
              </Button>
            ) : null}

            {previewSource ? (
              <Button
                type="button"
                onClick={onClear}
                disabled={disabled}
                buttonStyle="softDanger"
                size="xs"
              >
                <Trash2 size={14} />
                Remover
              </Button>
            ) : null}

            {canChangeImage ? extraActions : null}
          </div>
        </div>
      </div>

      <input
        id={resolvedInputId}
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error ?? selectionError ? (
        <p className="px-1 text-[10px] font-medium uppercase tracking-wider text-danger">
          {error ?? selectionError}
        </p>
      ) : null}
    </div>
  );
};
