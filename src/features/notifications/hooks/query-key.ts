export const NOTIFICATION_KEYS = {
  all: ["notifications"] as const,
  lists: () => [...NOTIFICATION_KEYS.all, "list"] as const,
  list: (userId?: number) => [...NOTIFICATION_KEYS.lists(), userId] as const,
  unreads: () => [...NOTIFICATION_KEYS.all, "unread"] as const,
  unread: (userId?: number) => [...NOTIFICATION_KEYS.unreads(), userId] as const,
  enums: () => [...NOTIFICATION_KEYS.all, "enums"] as const,
  typeEnum: () => [...NOTIFICATION_KEYS.enums(), "type"] as const,
};
