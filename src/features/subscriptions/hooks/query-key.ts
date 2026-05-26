export const SUBSCRIPTION_KEYS = {
  all: ["subscriptions"] as const,
  enums: () => [...SUBSCRIPTION_KEYS.all, "enums"] as const,
  typeEnum: () => [...SUBSCRIPTION_KEYS.enums(), "type"] as const,
};
