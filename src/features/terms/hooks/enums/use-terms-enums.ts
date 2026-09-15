import { useQuery } from "@tanstack/react-query";
import { TermsService } from "../../services/terms.services";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { TERMS_KEYS } from "../query-key";

export const useTermsAudienceEnum = (filterAllowed: boolean = true) => {
  return useQuery({
    queryKey: [...TERMS_KEYS.audienceEnum(), filterAllowed],
    queryFn: () => TermsService.getAudienceEnum(),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    select: (data) =>
      mapToSelectOptions({
        data,
        labelKey: "name",
        valueKey: "value",
        filterAllowed,
      }),
  });
};

export const useTermsStatusEnum = (filterAllowed: boolean = false) => {
  return useQuery({
    queryKey: [...TERMS_KEYS.statusEnum(), filterAllowed],
    queryFn: () => TermsService.getStatusEnum(),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    select: (data) =>
      mapToSelectOptions({
        data,
        labelKey: "name",
        valueKey: "value",
        filterAllowed,
      }),
  });
};
