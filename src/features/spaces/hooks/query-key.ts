export const SPACE_KEYS = {
  all: ["spaces"] as const,
  lists: () => [...SPACE_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...SPACE_KEYS.lists(), filters] as const,
  details: () => [...SPACE_KEYS.all, "detail"] as const,
  detail: (id: number) => [...SPACE_KEYS.details(), id] as const,

  tables: (spaceId: number) => [...SPACE_KEYS.detail(spaceId), "tables"] as const,
  table: (id: number) => [...SPACE_KEYS.all, "table", id] as const,

  bookings: ["space-bookings"] as const,
  bookingLists: () => [...SPACE_KEYS.bookings, "list"] as const,
  bookingList: (filters: Record<string, unknown>) => [...SPACE_KEYS.bookingLists(), filters] as const,
  bookingDetail: (id: number) => [...SPACE_KEYS.bookings, "detail", id] as const,
  bookingMessages: (bookingId: number) => [...SPACE_KEYS.bookingDetail(bookingId), "messages"] as const,

  // Enums
  spaceStatusEnum: () => [...SPACE_KEYS.all, "enums", "status"] as const,
  tableShapeEnum: () => [...SPACE_KEYS.all, "enums", "shape"] as const,
  bookingStatusEnum: () => [...SPACE_KEYS.bookings, "enums", "status"] as const,
};
