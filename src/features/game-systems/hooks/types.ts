import type {
  IGetPaginatedParams,
  IPaginationResponse,
} from "@/src/interfaces";
import type { IGameSystem } from "../schemas/game-system.schema";

type IGetGameSystems = IGetPaginatedParams & { enabled?: boolean };

type IGetAllGameSystemsResponse = {
  items: IGameSystem[];
  pagination: IPaginationResponse;
};

export type { IGetAllGameSystemsResponse, IGetGameSystems };
