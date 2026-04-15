import { useQuery } from "@tanstack/react-query";
import { ImageService } from "@/src/features/images/services/images.services";
import { IMAGE_KEYS } from "./query-key";

export function useImageById(id?: number) {
  return useQuery({
    queryKey: IMAGE_KEYS.detail(id),
    queryFn: () => ImageService.getById(id!),
    enabled: id !== undefined && id !== null,
  });
}
