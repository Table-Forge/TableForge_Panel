import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { api } from "@/src/features/api";

const ENDPOINT = "/friendships";

export const FriendshipService = {
  getStatusEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/friendship-status`);
    return data;
  },
};
