import { api } from "@/src/features/api";
import { type ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import type {
  IGetPaginatedParams,
  INormalizedPaginatedResponse,
} from "@/src/interfaces";

const ENDPOINT = "/campaigns";

export const CampaignService = {
  getPaginated: async (
    params: IGetPaginatedParams = {},
  ): Promise<INormalizedPaginatedResponse<ICampaign>> => {
    const { data } = await api.get(ENDPOINT, {
      params,
    });

    return data;
  },
  getAll: async (params: IGetPaginatedParams = {}): Promise<ICampaign[]> => {
    const { data } = await api.get(ENDPOINT, {
      params,
    });

    return data;
  },
};
