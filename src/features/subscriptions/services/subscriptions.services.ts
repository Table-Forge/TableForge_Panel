import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { api } from "@/src/features/api";

const ENDPOINT = "/subscriptions";

export const SubscriptionService = {
  getTypeEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/subscription-type`);
    return data;
  },
};
