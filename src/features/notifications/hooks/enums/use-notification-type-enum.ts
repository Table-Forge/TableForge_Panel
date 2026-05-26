import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { NotificationService } from "@/src/features/notifications/services/notifications.services";
import { handleError } from "@/src/utils/error-handler";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { NOTIFICATION_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

export const useNotificationTypeEnum = (enabled = true) => {
  const typeEnumQuery = useQuery({
    queryKey: NOTIFICATION_KEYS.typeEnum(),
    queryFn: () => NotificationService.getTypeEnum(),
    select: (data) =>
      mapToSelectOptions({ data, labelKey: "name", valueKey: "value" }),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (typeEnumQuery.error) handleError(typeEnumQuery.error as Error);
  }, [typeEnumQuery.error]);

  return {
    notificationTypeEnum: (typeEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingNotificationTypeEnum: typeEnumQuery.isPending,
    typeEnumQuery,
  };
};
