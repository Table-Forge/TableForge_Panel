import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TermsService, type IGetTermsParams } from "../services/terms.services";
import { TERMS_KEYS } from "./query-key";
import { type ITermsDocumentList } from "../schemas/terms.schema";

export const useTermsList = (params: IGetTermsParams = {}) => {
  return useQuery({
    queryKey: TERMS_KEYS.list(params as Record<string, unknown>),
    queryFn: () => TermsService.getPaginated(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useTermsById = (id?: number) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: TERMS_KEYS.byId(id ?? 0),
    queryFn: () => TermsService.getById(id!),
    enabled: !!id && !isNaN(id),
    placeholderData: () => {
      if (!id) return undefined;
      const lists = queryClient.getQueriesData<{ items: ITermsDocumentList[] }>({
        queryKey: ["terms", "list"],
      });
      for (const [, data] of lists) {
        if (!data?.items) continue;
        const item = data.items.find((i) => i.id === id);
        if (item) return item as unknown as ReturnType<typeof TermsService.getById> extends Promise<infer U> ? U : never;
      }
      return undefined;
    },
  });
};

export const useTermsAcceptances = (
  id?: number,
  page: number = 1,
  size: number = 20,
) => {
  return useQuery({
    queryKey: TERMS_KEYS.acceptances(id ?? 0, page, size),
    queryFn: () => TermsService.getAcceptances(id!, page, size),
    enabled: !!id && !isNaN(id),
    placeholderData: (previousData) => previousData,
  });
};
