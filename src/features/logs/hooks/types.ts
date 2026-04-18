import type {
  IGetPaginatedParams,
  IPaginationResponse,
} from "@/src/interfaces";
import type { ILog } from "../schemas/log.schema";

type IGetLogs = IGetPaginatedParams & {
  enabled?: boolean;
};

type IGetAllLogsResponse = {
  items: ILog[];
  pagination: IPaginationResponse;
};

export type { IGetAllLogsResponse, IGetLogs };
