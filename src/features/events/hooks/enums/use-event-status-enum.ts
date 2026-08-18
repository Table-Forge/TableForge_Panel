import { useQuery } from "@tanstack/react-query";
import { EventService } from "../../services/events.services";
import { mapToSelectOptions } from "@/src/utils/map-to-select-options";
import { EVENT_KEYS } from "../query-key";

export const useEventStatusEnum = () => {
  return useQuery({
    queryKey: [...EVENT_KEYS.all, "enums", "event-status"],
    queryFn: () => EventService.getEnum("event-status"),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    select: (data) => mapToSelectOptions({ data, labelKey: "name", valueKey: "value" }),
  });
};
