import { useAllImages } from "@/src/features/images/hooks/use-all-images";
import { type IImage } from "@/src/features/images/schemas/image.schema";
import { useBoundStore } from "@/src/store";
import { toImageSource } from "@/src/utils/image";
import { useMemo, useState } from "react";

const PICKER_PAGE_SIZE = 24;

type ModalExistingImagePickerProps = {
  emptyMessage?: string;
  imageType?: IImage["type"];
  onSelect: (image: IImage) => void;
  searchPlaceholder?: string;
  selectedImageId?: number;
  selectedImageUrl?: string;
};

export function ModalExistingImagePicker({
  emptyMessage = "Nenhuma imagem encontrada.",
  imageType,
  onSelect,
  searchPlaceholder = "Buscar imagem por nome",
  selectedImageId,
  selectedImageUrl,
}: ModalExistingImagePickerProps) {
  const closeModal = useBoundStore((state) => state.closeModal);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAllImages({
    page: 1,
    size: PICKER_PAGE_SIZE,
    search,
  });

  const availableImages = useMemo<IImage[]>(
    () =>
      (data?.items ?? []).filter((image) =>
        imageType ? image.type === imageType : true,
      ),
    [data?.items, imageType],
  );

  const handleSelect = (image: IImage) => {
    onSelect(image);
    closeModal();
  };

  return (
    <div className="space-y-4">
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={searchPlaceholder}
        className="h-10 w-full rounded-xl border border-white/15 bg-background/60 px-3 text-sm text-white outline-none placeholder:text-white/35"
      />

      {isLoading ? (
        <p className="text-sm text-white/75">Carregando imagens...</p>
      ) : availableImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {availableImages.map((image) => {
            const previewSource = toImageSource(image.url);
            const isSelected = isImageSelected({
              image,
              previewSource,
              selectedImageId,
              selectedImageUrl,
            });

            return (
              <button
                key={String(image.id ?? image.uuid)}
                type="button"
                onClick={() => handleSelect(image)}
                disabled={!previewSource}
                className={`rounded-xl border p-2 text-left transition ${
                  isSelected
                    ? "border-secondary bg-secondary/10"
                    : "border-white/15 bg-background/40 hover:border-white/30"
                } ${previewSource ? "opacity-100" : "opacity-60"}`}
              >
                <div className="mb-2 aspect-square overflow-hidden rounded-lg border border-white/15 bg-background/60">
                  {previewSource ? (
                    <img
                      src={previewSource}
                      alt={image.name || "Imagem"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-white/55">
                      Sem prévia
                    </div>
                  )}
                </div>
                <p className="truncate text-xs text-white/90">
                  {image.name || `Imagem ${image.id ?? ""}`}
                </p>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-white/75">{emptyMessage}</p>
      )}
    </div>
  );
}

function isImageSelected({
  image,
  previewSource,
  selectedImageId,
  selectedImageUrl,
}: {
  image: IImage;
  previewSource: string;
  selectedImageId?: number;
  selectedImageUrl?: string;
}) {
  if (
    image.id !== undefined &&
    selectedImageId !== undefined &&
    Number(image.id) === Number(selectedImageId)
  ) {
    return true;
  }

  return Boolean(
    previewSource &&
      selectedImageUrl &&
      previewSource === toImageSource(selectedImageUrl),
  );
}
