import { useQuery } from "@tanstack/react-query";
import { EventService } from "../../services/events.services";

export const useEventStatusEnum = () => {
  return useQuery({
    queryKey: ["events", "enums", "event-status"],
    queryFn: () => EventService.getEnum("event-status"),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    select: (data: Array<{ name: string; value: string }>) =>
      data.map((item) => ({
        label: item.name,
        name: item.name,
        value: item.value,
      })),
  });
};
