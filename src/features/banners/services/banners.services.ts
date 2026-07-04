import { api } from "../../api";
import type { IBanner, IBannerCreate } from "../schemas/banner.schema";
import type { IGetPaginatedParams, IPaginationResponse } from "@/src/interfaces";

const ENDPOINT = "/banners";

export const BannersService = {
  getPaginated: async ({
    page = 1,
    size = 20,
    search,
  }: IGetPaginatedParams = {}): Promise<{ items: IBanner[], pagination: IPaginationResponse }> => {
    const { data } = await api.get(ENDPOINT, {
      params: { page, size, search },
    });
    return data;
  },
  create: async (payload: IBannerCreate): Promise<IBanner> => {
    const { data } = await api.post(ENDPOINT, payload);
    return data;
  },
  getById: async (id: number): Promise<IBanner> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);
    return data;
  },
  update: async (payload: Partial<IBannerCreate> & { id: number }): Promise<IBanner> => {
    const { id, ...rest } = payload;
    const { data } = await api.put(`${ENDPOINT}/${id}`, rest);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    const { data } = await api.delete(`${ENDPOINT}/${id}`);
    return data;
  },
};
