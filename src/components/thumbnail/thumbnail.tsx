import type { IImage } from "@/src/features/images/schemas/image.schema";
import { toImageSource } from "@/src/utils/image";
import { useBoundStore } from "@/src/store";
import { ModalImage } from "@/src/components/modals/modal-image/modal-image";

type TThumbnailImage = Pick<IImage, "name" | "url"> | string | null | undefined;

type TThumbnailProps = {
  image?: TThumbnailImage;
  width?: number | string;
  height?: number | string;
  alt?: string;
  className?: string;
};

export function Thumbnail({
  image,
  width = 40,
  height = 40,
  alt,
  className = "",
}: TThumbnailProps) {
  const openModal = useBoundStore((state) => state.openModal);

  const imageUrl = typeof image === "string" ? image : image?.url;
  const imageName = typeof image === "string" ? undefined : image?.name;
  const source = toImageSource(imageUrl);

  if (!source) return "-";

  const finalAlt = alt || imageName || "Imagem";

  return (
    <img
      src={source}
      alt={finalAlt}
      style={{ width, height }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal("Visualização", <ModalImage alt={finalAlt} src={source} />, "md");
      }}
      role="button"
      className={`cursor-pointer rounded-lg border border-white/15 object-contain p-0.5 hover:border-white/40 transition-colors ${className}`}
    />
  );
}
