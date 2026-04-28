import { api } from "@/src/features/api";
import { type IGameSystem } from "@/src/features/game-systems/schemas/game-system.schema";
import type {
  IGetAllGameSystemsResponse,
  IGetGameSystems,
} from "../hooks/types";

const ENDPOINT = "/gamesystems";

export const GameSystemService = {
  getAll: async (
    params: IGetGameSystems = {},
  ): Promise<IGetAllGameSystemsResponse> => {
    const { enabled: _enabled, ...queryParams } = params;
    const { data } = await api.get<IGetAllGameSystemsResponse>(ENDPOINT, {
      params: queryParams,
    });

    return data;
  },

  getById: async (id: number): Promise<IGameSystem> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);
    return data;
  },

  create: async (payload: IGameSystem) => api.post(ENDPOINT, payload),
  update: async (payload: IGameSystem) => api.put(ENDPOINT, payload),
  delete: async (id: number) => api.delete(`${ENDPOINT}/${id}`),
};
