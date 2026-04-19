import { api } from "@/src/features/api";
import { type IImage } from "@/src/features/images/schemas/image.schema";
import type { IGetAllImagesResponse, IGetImages } from "../hooks/types";

const ENDPOINT = "/images";

export const ImageService = {
  getAll: async (params: IGetImages = {}): Promise<IGetAllImagesResponse> => {
    const { enabled: _enabled, ...queryParams } = params;
    const { data } = await api.get<IGetAllImagesResponse>(ENDPOINT, {
      params: queryParams,
    });

    return data;
  },

  getById: async (id: number): Promise<IImage> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);
    return data;
  },

  getByUuid: async (uuid: string): Promise<IImage> => {
    const { data } = await api.get(`${ENDPOINT}/uuid/${uuid}`);
    return data;
  },

  create: async (payload: IImage): Promise<string> => {
    const { data } = await api.post(ENDPOINT, payload);
    return data;
  },

  update: async (payload: IImage): Promise<string> => {
    const { data } = await api.put(ENDPOINT, payload);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`${ENDPOINT}/${id}`);
    return data;
  },
};
