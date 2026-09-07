import type {
  IGetPaginatedParams,
  IPaginationResponse,
} from "@/src/interfaces";
import type { IRequestHistoryItem } from "../schemas/request-history.schema";

type IGetRequestHistory = IGetPaginatedParams & {
  enabled?: boolean;
  userId?: number | string;
  statusCode?: number | string;
  minTotalMs?: number | string;
  onlyWithDetails?: boolean;
};

type IGetAllRequestHistoryResponse = {
  items: IRequestHistoryItem[];
  pagination: IPaginationResponse;
};

export type { IGetAllRequestHistoryResponse, IGetRequestHistory };
