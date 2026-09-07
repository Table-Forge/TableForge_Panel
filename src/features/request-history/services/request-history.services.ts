import { api } from "@/src/features/api";
import type { IRequestHistory } from "@/src/features/request-history/schemas/request-history.schema";
import { toRangeEnd, toRangeStart } from "@/src/utils/format";
import type {
  IGetAllRequestHistoryResponse,
  IGetRequestHistory,
} from "../hooks/types";

const ENDPOINT = "/requesthistory";

export const RequestHistoryService = {
  getAll: async (
    params: IGetRequestHistory = {},
  ): Promise<IGetAllRequestHistoryResponse> => {
    const { enabled: _enabled, ...queryParams } = params;
    const normalizedParams = Object.fromEntries(
      Object.entries({
        ...queryParams,
        startDate: toRangeStart(queryParams.startDate),
        endDate: toRangeEnd(queryParams.endDate),
        onlyWithDetails: queryParams.onlyWithDetails ? true : undefined,
      }).filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      ),
    );

    const { data } = await api.get<IGetAllRequestHistoryResponse>(ENDPOINT, {
      params: normalizedParams,
    });

    return data;
  },

  getById: async (id: number): Promise<IRequestHistory> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);
    return data;
  },
};
