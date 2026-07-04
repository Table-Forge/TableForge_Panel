import { api } from "@/src/features/api";
import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { type ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import type { IGetAllCampaignsResponse, IGetCampaigns } from "../hooks/types";

const ENDPOINT = "/campaigns";

export const CampaignService = {
  getAll: async (
    params: IGetCampaigns = {},
  ): Promise<IGetAllCampaignsResponse> => {
    const { enabled: _enabled, ...queryParams } = params;

    const { data } = await api.get<IGetAllCampaignsResponse>(ENDPOINT, {
      params: queryParams,
    });

    return data;
  },
  getById: async (id: number): Promise<ICampaign> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);
    return data;
  },
  create: async (payload: ICampaign) => api.post(ENDPOINT, payload),
  update: async (payload: ICampaign) => api.put(ENDPOINT, payload),
  delete: async (id: number) => api.delete(`${ENDPOINT}/${id}`),
  getDifficultyLevelEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/difficulty-level`);
    return data;
  },
  getCampaignStatusEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/campaign-status`);
    return data;
  },
  getCampaignFrequencyEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/frequency`);
    return data;
  },
};
