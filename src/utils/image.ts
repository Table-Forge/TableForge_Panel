const normalizeImageValue = (value?: string) => {
  if (!value) return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  const hasDoubleQuotes = trimmed.startsWith('"') && trimmed.endsWith('"');
  const hasSingleQuotes = trimmed.startsWith("'") && trimmed.endsWith("'");

  if (hasDoubleQuotes || hasSingleQuotes) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
};

export const toImageSource = (value?: string) => {
  const normalizedValue = normalizeImageValue(value);
  if (!normalizedValue) return "";

  if (
    /^data:image\//i.test(normalizedValue) ||
    /^https?:\/\//i.test(normalizedValue)
  ) {
    return normalizedValue;
  }

  return `data:image/*;base64,${normalizedValue}`;
};

export const isImageDataUrl = (value?: string) =>
  /^data:image\//i.test(normalizeImageValue(value));

export const isHttpUrl = (value?: string) =>
  /^https?:\/\//i.test(normalizeImageValue(value));

export const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
export const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;

export const dataUrlToFile = (dataUrl: string, filename: string): File => {
  const [meta, base64] = normalizeImageValue(dataUrl).split(",");
  const mime = meta.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], filename, { type: mime });
};

export const validateImageFile = (
  file: File,
  {
    maxSize,
    acceptedTypes = ACCEPTED_IMAGE_MIME_TYPES,
  }: { maxSize: number; acceptedTypes?: string[] },
): string | null => {
  if (!acceptedTypes.includes(file.type)) {
    return "Formato inválido. Use JPEG, PNG, WEBP ou GIF.";
  }

  if (file.size > maxSize) {
    const maxMb = Math.round(maxSize / (1024 * 1024));
    return `Imagem muito grande. O tamanho máximo é de ${maxMb} MB.`;
  }

  return null;
};
