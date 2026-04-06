import { useQuery } from "@tanstack/react-query";
import { CampaignService } from "../services/campaigns.services";
import { CAMPAIGNS } from "./query-key";
import type { IGetCampaigns } from "./types";

export const useAllCampaigns = (params?: IGetCampaigns) => {
  const query = useQuery({
    queryKey: [CAMPAIGNS, params],
    queryFn: () => CampaignService.getAll(params),
    placeholderData: (previousData) => previousData,
    enabled: params?.enabled,
  });

  return query;
};
