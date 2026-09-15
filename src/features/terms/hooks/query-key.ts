export const TERMS = "terms";

export const TERMS_KEYS = {
  all: [TERMS] as const,
  list: (params: Record<string, unknown>) =>
    [...TERMS_KEYS.all, "list", params] as const,
  byId: (id: number) => [...TERMS_KEYS.all, id] as const,
  acceptances: (id: number, page: number, size: number) =>
    [...TERMS_KEYS.all, id, "acceptances", { page, size }] as const,
  audienceEnum: () => [...TERMS_KEYS.all, "enums", "terms-audience"] as const,
  statusEnum: () => [...TERMS_KEYS.all, "enums", "terms-status"] as const,
};
