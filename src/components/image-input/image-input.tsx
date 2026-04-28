import { ImagePlus, Trash2 } from "lucide-react";
import { useId, useRef } from "react";
import { toImageSource } from "@/src/utils/image";
import type { IImageInput } from "./image-input.interfaces";

export const ImageInput: React.FC<IImageInput> = ({
  label = "Imagem",
  value,
  disabled,
  error,
  onChange,
  onClear,
  extraActions,
}) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const previewSource = toImageSource(value);

  const handleOpenFileSelector = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      <label
        htmlFor={inputId}
        className="text-xs font-bold uppercase tracking-[0.2em] text-grays-100"
      >
        {label}
      </label>

      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-primary/60 p-3">
        <button
          type="button"
          onClick={handleOpenFileSelector}
          disabled={disabled}
          className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-background/70 transition hover:border-secondary/50 disabled:cursor-not-allowed disabled:opacity-60"
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
            <button
              type="button"
              onClick={handleOpenFileSelector}
              disabled={disabled}
              className="inline-flex items-center rounded-lg border border-secondary/40 bg-secondary/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-secondary/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {previewSource ? "Trocar imagem" : "Selecionar imagem"}
            </button>

            {previewSource ? (
              <button
                type="button"
                onClick={onClear}
                disabled={disabled}
                className="inline-flex items-center gap-1 rounded-lg border border-danger/40 bg-danger/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-danger transition hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={14} />
                Remover
              </button>
            ) : null}

            {extraActions}
          </div>
        </div>
      </div>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error ? (
        <p className="px-1 text-[10px] font-medium uppercase tracking-wider text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
};
