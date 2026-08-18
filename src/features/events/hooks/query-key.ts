export const EVENTS = "events";

export const EVENT_KEYS = {
  all: [EVENTS] as const,
  list: (params: Record<string, unknown>) => [...EVENT_KEYS.all, "list", params] as const,
  byId: (id: number) => [...EVENT_KEYS.all, id] as const,
};
