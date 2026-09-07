import dayjs from "dayjs";
import { api } from "@/src/features/api";
import type { ILog } from "@/src/features/logs/schemas/log.schema";
import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import type { IGetAllLogsResponse, IGetLogs } from "../hooks/types";

const ENDPOINT = "/logs";

const toRangeStart = (value?: Date | string) =>
  value ? dayjs(value).startOf("day").toISOString() : undefined;

const toRangeEnd = (value?: Date | string) =>
  value ? dayjs(value).endOf("day").toISOString() : undefined;

export const LogService = {
  getAll: async (params: IGetLogs = {}): Promise<IGetAllLogsResponse> => {
    const { enabled: _enabled, ...queryParams } = params;
    const normalizedParams = Object.fromEntries(
      Object.entries({
        ...queryParams,
        startDate: toRangeStart(queryParams.startDate),
        endDate: toRangeEnd(queryParams.endDate),
      }).filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      ),
    );

    const { data } = await api.get<IGetAllLogsResponse>(ENDPOINT, {
      params: normalizedParams,
    });

    return data;
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
