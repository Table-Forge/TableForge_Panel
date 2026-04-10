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
