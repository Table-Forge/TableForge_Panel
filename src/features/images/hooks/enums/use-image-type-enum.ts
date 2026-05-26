import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { ImageService } from "@/src/features/images/services/images.services";
import { handleError } from "@/src/utils/error-handler";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { IMAGE_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

export const useImageTypeEnum = (enabled = true) => {
  const imageTypeEnumQuery = useQuery({
    queryKey: IMAGE_KEYS.imageTypeEnum(),
    queryFn: () => ImageService.getImageTypeEnum(),
    select: (data) =>
      mapToSelectOptions({
        data,
        labelKey: "name",
        valueKey: "value",
      }),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (imageTypeEnumQuery.error) {
      handleError(imageTypeEnumQuery.error as Error);
    }
  }, [imageTypeEnumQuery.error]);

  return {
    imageTypeEnum: (imageTypeEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingImageTypeEnum: imageTypeEnumQuery.isPending,
    imageTypeEnumQuery,
  };
};
