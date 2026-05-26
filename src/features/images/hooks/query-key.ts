import type { IGetImages } from "./types";

export const IMAGE_KEYS = {
  all: ["images"] as const,
  lists: () => [...IMAGE_KEYS.all, "list"] as const,
  list: (filters: IGetImages = {}) => [...IMAGE_KEYS.lists(), filters] as const,
  details: () => [...IMAGE_KEYS.all, "detail"] as const,
  detail: (id?: number) => [...IMAGE_KEYS.details(), id] as const,
  byUuid: (uuid?: string) => [...IMAGE_KEYS.details(), "uuid", uuid] as const,
  enums: () => [...IMAGE_KEYS.all, "enums"] as const,
  imageTypeEnum: () => [...IMAGE_KEYS.enums(), "image-type"] as const,
  imageStatusEnum: () => [...IMAGE_KEYS.enums(), "image-status"] as const,
};
