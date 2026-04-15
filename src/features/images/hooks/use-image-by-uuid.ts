import { useQuery } from "@tanstack/react-query";
import { ImageService } from "@/src/features/images/services/images.services";
import { IMAGE_KEYS } from "./query-key";

export function useImageByUuid(uuid?: string) {
  return useQuery({
    queryKey: IMAGE_KEYS.byUuid(uuid),
    queryFn: () => ImageService.getByUuid(uuid!),
    enabled: Boolean(uuid),
  });
}
