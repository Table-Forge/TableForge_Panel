export const JOIN_REQUEST_KEYS = {
  all: ["join-requests"] as const,
  enums: () => [...JOIN_REQUEST_KEYS.all, "enums"] as const,
  statusEnum: () => [...JOIN_REQUEST_KEYS.enums(), "status"] as const,
};
