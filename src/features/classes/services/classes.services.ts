import { api } from "@/src/features/api";
import type { IClass } from "@/src/features/classes/schemas/class.schema";
import type { IGetAllClassesResponse, IGetClasses } from "../hooks/types";

const ENDPOINT = "/classes";

export const ClassService = {
  getAll: async (
    params: IGetClasses = {},
  ): Promise<IGetAllClassesResponse> => {
    const { enabled: _enabled, ...queryParams } = params;
    const { data } = await api.get<IGetAllClassesResponse>(ENDPOINT, {
      params: queryParams,
    });

    return data;
  },

  getById: async (id: number): Promise<IClass> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);
    return data;
  },

  create: async (payload: IClass) => api.post(ENDPOINT, payload),
  update: async (payload: IClass) => api.put(ENDPOINT, payload),
  delete: async (id: number) => api.delete(`${ENDPOINT}/${id}`),
};
