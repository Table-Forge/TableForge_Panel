export const NOTIFICATION_KEYS = {
  all: ["notifications"] as const,
  enums: () => [...NOTIFICATION_KEYS.all, "enums"] as const,
  typeEnum: () => [...NOTIFICATION_KEYS.enums(), "type"] as const,
};
