import { useQuery } from "@tanstack/react-query";
import { ImageService } from "@/src/features/images/services/images.services";
import { IMAGE_LIST } from "./query-key";
import type { IGetAllImagesResponse, IGetImages } from "./types";

export function useImages(params: IGetImages = {}) {
  return useQuery({
    queryKey: [IMAGE_LIST, params],
    queryFn: () => ImageService.getAll(params),
    placeholderData: (previousData: IGetAllImagesResponse | undefined) =>
      previousData,
    enabled: params.enabled ?? true,
  });
}
