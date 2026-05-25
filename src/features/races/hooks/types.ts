import type {
  IGetPaginatedParams,
  IPaginationResponse,
} from "@/src/interfaces";
import type { IRace } from "../schemas/race.schema";

type IGetRaces = IGetPaginatedParams & {
  enabled?: boolean;
};

type IGetAllRacesResponse = {
  items: IRace[];
  pagination: IPaginationResponse;
};

export type { IGetAllRacesResponse, IGetRaces };
