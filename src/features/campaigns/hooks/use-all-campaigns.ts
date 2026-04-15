import { useQuery } from "@tanstack/react-query";
import { CampaignService } from "../services/campaigns.services";
import { CAMPAIGN_KEYS } from "./query-key";
import type { IGetCampaigns } from "./types";

export const useAllCampaigns = (params?: IGetCampaigns) => {
  const query = useQuery({
    queryKey: CAMPAIGN_KEYS.list(params),
    queryFn: () => CampaignService.getAll(params),
    placeholderData: (previousData) => previousData,
    enabled: params?.enabled,
  });

  return query;
};
