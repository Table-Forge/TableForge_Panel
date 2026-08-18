import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EVENT_KEYS } from "./query-key";
import { EventService, type IGetEventsParams } from "../services/events.services";
import { type IEvent } from "../schemas/events.schema";

export const useEvents = (params: IGetEventsParams = {}) => {
  return useQuery({
    queryKey: EVENT_KEYS.list(params as Record<string, unknown>),
    queryFn: () => EventService.getPaginated(params),
  });
};

export const useEventById = (id: number) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: EVENT_KEYS.byId(id),
    queryFn: () => EventService.getById(id),
    enabled: !!id,
    placeholderData: () => {
      const lists = queryClient.getQueriesData<{ items: IEvent[] }>({ queryKey: ["events", "list"] });
      for (const [, data] of lists) {
        if (!data?.items) continue;
        const item = data.items.find((i: IEvent) => i.id === id);
        if (item) return item;
      }
      return undefined;
    },
  });
};
