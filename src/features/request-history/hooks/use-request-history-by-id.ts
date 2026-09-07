import { useQuery } from "@tanstack/react-query";
import { RequestHistoryService } from "@/src/features/request-history/services/request-history.services";
import { REQUEST_HISTORY_KEYS } from "./query-key";

export function useRequestHistoryById(id?: number) {
  return useQuery({
    queryKey: REQUEST_HISTORY_KEYS.detail(id),
    queryFn: () => RequestHistoryService.getById(id!),
    enabled: id !== undefined && id !== null,
  });
}
