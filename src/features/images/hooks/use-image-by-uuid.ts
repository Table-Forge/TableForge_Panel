import { useQuery } from "@tanstack/react-query";
import { ImageService } from "@/src/features/images/services/images.services";
import { IMAGE_UUID } from "./query-key";

export function useImageByUuid(uuid?: string) {
  return useQuery({
    queryKey: [IMAGE_UUID, uuid],
    queryFn: () => ImageService.getByUuid(uuid!),
    enabled: Boolean(uuid),
  });
}
