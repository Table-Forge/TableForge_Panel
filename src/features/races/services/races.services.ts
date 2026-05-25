import { api } from "@/src/features/api";
import type { IRace } from "@/src/features/races/schemas/race.schema";
import type { IGetAllRacesResponse, IGetRaces } from "../hooks/types";

const ENDPOINT = "/races";

export const RaceService = {
  getAll: async (params: IGetRaces = {}): Promise<IGetAllRacesResponse> => {
    const { enabled: _enabled, ...queryParams } = params;
    const { data } = await api.get<IGetAllRacesResponse>(ENDPOINT, {
      params: queryParams,
    });

    return data;
  },

  getById: async (id: number): Promise<IRace> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);
    return data;
  },

  create: async (payload: IRace) => api.post(ENDPOINT, payload),
  update: async (payload: IRace) => api.put(ENDPOINT, payload),
  delete: async (id: number) => api.delete(`${ENDPOINT}/${id}`),
};
