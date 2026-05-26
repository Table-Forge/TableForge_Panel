import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { ImageService } from "@/src/features/images/services/images.services";
import { handleError } from "@/src/utils/error-handler";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { IMAGE_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

export const useImageStatusEnum = (enabled = true) => {
  const imageStatusEnumQuery = useQuery({
    queryKey: IMAGE_KEYS.imageStatusEnum(),
    queryFn: () => ImageService.getImageStatusEnum(),
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
    if (imageStatusEnumQuery.error) {
      handleError(imageStatusEnumQuery.error as Error);
    }
  }, [imageStatusEnumQuery.error]);

  return {
    imageStatusEnum: (imageStatusEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingImageStatusEnum: imageStatusEnumQuery.isPending,
    imageStatusEnumQuery,
  };
};
