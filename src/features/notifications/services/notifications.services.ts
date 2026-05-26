import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { api } from "@/src/features/api";

const ENDPOINT = "/notifications";

export const NotificationService = {
  getTypeEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/notification-type`);
    return data;
  },
};
