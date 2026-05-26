export const FRIENDSHIP_KEYS = {
  all: ["friendships"] as const,
  enums: () => [...FRIENDSHIP_KEYS.all, "enums"] as const,
  statusEnum: () => [...FRIENDSHIP_KEYS.enums(), "status"] as const,
};
