import type {
  IGetPaginatedParams,
  IPaginationResponse,
} from "@/src/interfaces";
import type { ICampaign } from "../schemas/campaign.schema";

type IGetCampaigns = IGetPaginatedParams & { enabled?: boolean };

type IGetAllCampaignsResponse = {
  items: ICampaign[];
  pagination: IPaginationResponse;
};

export type { IGetAllCampaignsResponse, IGetCampaigns };
