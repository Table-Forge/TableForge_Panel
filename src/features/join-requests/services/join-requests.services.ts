import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { api } from "@/src/features/api";

const ENDPOINT = "/joinrequests";

export const JoinRequestService = {
  getStatusEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/join-request-status`);
    return data;
  },
};
