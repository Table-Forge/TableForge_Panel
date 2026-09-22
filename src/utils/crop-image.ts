export interface IArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function createImage(url: string): Promise<HTMLImageElement> {
  let objectUrl = "";
  let targetSrc = url;

  if (/^https?:\/\//i.test(url)) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        targetSrc = objectUrl;
      }
    } catch {
      targetSrc = url;
    }
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(image);
    });
    image.addEventListener("error", (error) => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(error);
    });
    image.setAttribute("crossOrigin", "anonymous");
    image.src = targetSrc;
  });
}

export async function getCroppedImg(
  imageSource: HTMLImageElement | string,
  pixelCrop: IArea,
  mimeType = "image/webp",
  isNaturalPixels = false,
): Promise<string> {
  const image =
    typeof imageSource === "string"
      ? await createImage(imageSource)
      : imageSource;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Não foi possível obter o contexto 2D do canvas");
  }

  const scaleX =
    isNaturalPixels || !image.width ? 1 : image.naturalWidth / image.width;
  const scaleY =
    isNaturalPixels || !image.height ? 1 : image.naturalHeight / image.height;

  const sourceX = Math.max(0, Math.round(pixelCrop.x * scaleX));
  const sourceY = Math.max(0, Math.round(pixelCrop.y * scaleY));
  const sourceWidth = Math.min(
    Math.round(pixelCrop.width * scaleX),
    image.naturalWidth - sourceX,
  );
  const sourceHeight = Math.min(
    Math.round(pixelCrop.height * scaleY),
    image.naturalHeight - sourceY,
  );

  canvas.width = Math.max(1, sourceWidth);
  canvas.height = Math.max(1, sourceHeight);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas.toDataURL(mimeType, 0.92);
}
