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
  imageSrc: string,
  pixelCrop: IArea,
  mimeType = "image/jpeg",
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Não foi possível obter o contexto 2D do canvas");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return canvas.toDataURL(mimeType, 0.92);
}
