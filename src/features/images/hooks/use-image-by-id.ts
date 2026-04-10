import { useQuery } from "@tanstack/react-query";
import { ImageService } from "@/src/features/images/services/images.services";
import { IMAGE } from "./query-key";

export function useImageById(id?: number) {
  return useQuery({
    queryKey: [IMAGE, id],
    queryFn: () => ImageService.getById(id!),
    enabled: id !== undefined && id !== null,
  });
}
