import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { UserService } from "@/src/features/users/services/users.services";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { USER_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

export const useDocumentTypeEnum = (enabled = true) => {
  const documentTypeEnumQuery = useQuery({
    queryKey: USER_KEYS.documentTypeEnum(),
    queryFn: () => UserService.getDocumentTypeEnum(),
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

  return {
    documentTypeEnum: (documentTypeEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingDocumentTypeEnum: documentTypeEnumQuery.isPending,
    documentTypeEnumQuery,
  };
};
