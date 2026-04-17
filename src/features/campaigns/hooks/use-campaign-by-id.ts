import { handleError } from "@/src/utils/error-handler";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { CampaignService } from "../services/campaigns.services";
import { CAMPAIGN_KEYS } from "./query-key";

export function useCampaignById(id?: number) {
  const query = useQuery({
    queryKey: CAMPAIGN_KEYS.detail(id),
    queryFn: () => CampaignService.getById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (query.isError && !query.isFetching && query.error) {
      handleError(query.error);
    }
  }, [query.error, query.isError, query.isFetching]);

  return query;
}
