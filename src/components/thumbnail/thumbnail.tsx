import type { IImage } from "@/src/features/images/schemas/image.schema";
import { toImageSource } from "@/src/utils/image";

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
  const imageUrl = typeof image === "string" ? image : image?.url;
  const imageName = typeof image === "string" ? undefined : image?.name;
  const source = toImageSource(imageUrl);

  if (!source) return "-";

  return (
    <img
      src={source}
      alt={alt || imageName || "Imagem"}
      style={{ width, height }}
      className={`rounded-lg border border-white/15 object-contain p-0.5 ${className}`}
    />
  );
}
