import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { api } from "@/src/features/api";

const ENDPOINT = "/campaignmembers";

export const CampaignMemberService = {
  getRoleEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/campaign-member-role`);
    return data;
  },
};
