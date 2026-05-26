import type { IGetUsers } from "./types";

export const USER_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_KEYS.all, "list"] as const,
  list: (filters: IGetUsers = {}) => [...USER_KEYS.lists(), filters] as const,
  details: () => [...USER_KEYS.all, "detail"] as const,
  detail: (id?: number) => [...USER_KEYS.details(), id] as const,
  enums: () => [...USER_KEYS.all, "enum"] as const,
  genderEnum: () => [...USER_KEYS.enums(), "gender"] as const,
  statusEnum: () => [...USER_KEYS.enums(), "status"] as const,
  deliveryMethodEnum: () => [...USER_KEYS.enums(), "deliveryMethod"] as const,
  typeEnum: () => [...USER_KEYS.enums(), "type"] as const,
};
