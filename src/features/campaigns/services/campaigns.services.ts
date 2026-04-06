import { api } from "@/src/features/api";
import {
  CampaignSchema,
  type ICampaign,
} from "@/src/features/campaigns/schemas/campaign.schema";
import type {
  IGetPaginatedParams,
  INormalizedPaginatedResponse,
} from "@/src/interfaces";
import { normalizePaginatedResponse } from "@/src/utils/normalize-paginated-response";

const ENDPOINT = "/campaigns";

const asCampaignArray = (raw: unknown): ICampaign[] => {
  const parsed = CampaignSchema.array().safeParse(raw);
  if (parsed.success) return parsed.data;
  return [];
};

export const CampaignService = {
  getPaginated: async ({
    page = 1,
    size = 20,
    search,
  }: IGetPaginatedParams = {}): Promise<
    INormalizedPaginatedResponse<ICampaign>
  > => {
    const { data } = await api.get(ENDPOINT, {
      params: { page, size, search },
    });

    return normalizePaginatedResponse<ICampaign>({
      payload: data,
      requestedPage: page,
      requestedSize: size,
      parseItems: asCampaignArray,
    });
  },
  getAll: async ({
    page = 1,
    size = 20,
    search,
  }: IGetPaginatedParams = {}): Promise<ICampaign[]> => {
    const { data } = await api.get(ENDPOINT, {
      params: { page, size, search },
    });

    return data;
  },
};
