import { api } from "@/src/features/api";
import type { ILog } from "@/src/features/logs/schemas/log.schema";
import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import type { IGetAllLogsResponse, IGetLogs } from "../hooks/types";

const ENDPOINT = "/logs";

type TApiLogListResponse = Partial<IGetAllLogsResponse> & {
  page?: number;
  size?: number;
  totalItems?: number;
};

const normalizeLogListResponse = (
  data: TApiLogListResponse | undefined,
  fallbackPage: number,
  fallbackSize: number,
): IGetAllLogsResponse => {
  if (!data) {
    return {
      items: [],
      pagination: {
        page: fallbackPage,
        itemsPerPage: fallbackSize,
        filteredItems: 0,
      },
    };
  }

  if (data.pagination) {
    return {
      items: data.items ?? [],
      pagination: data.pagination,
    };
  }

  return {
    items: data.items ?? [],
    pagination: {
      page: data.page ?? fallbackPage,
      itemsPerPage: data.size ?? fallbackSize,
      filteredItems: data.totalItems ?? (data.items?.length ?? 0),
    },
  };
};

export const LogService = {
  getAll: async (params: IGetLogs = {}): Promise<IGetAllLogsResponse> => {
    const { enabled: _enabled, ...queryParams } = params;
    const normalizedParams = Object.fromEntries(
      Object.entries(queryParams).filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      ),
    );

    const { data } = await api.get<TApiLogListResponse>(ENDPOINT, {
      params: normalizedParams,
    });

    return normalizeLogListResponse(data, params.page ?? 1, params.size ?? 20);
  },

  getById: async (id: number): Promise<ILog> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);
    return data;
  },

  getLogTypeEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/log-type`);
    return data;
  },
};
