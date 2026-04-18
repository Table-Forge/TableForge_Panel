import { useQuery } from "@tanstack/react-query";
import { LogService } from "@/src/features/logs/services/logs.services";
import { LOG_KEYS } from "./query-key";

export function useLogById(id?: number) {
  return useQuery({
    queryKey: LOG_KEYS.detail(id),
    queryFn: () => LogService.getById(id!),
    enabled: id !== undefined && id !== null,
  });
}
