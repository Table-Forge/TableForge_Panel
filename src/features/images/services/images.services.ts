import { api } from "@/src/features/api";
import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { type IImage } from "@/src/features/images/schemas/image.schema";
import { dataUrlToFile, isImageDataUrl } from "@/src/utils/image";
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

  create: async (payload: IImage): Promise<IImage> => {
    const formData = new FormData();
    formData.append("File", dataUrlToFile(payload.content, payload.name));
    formData.append("Type", payload.type);
    formData.append("Name", payload.name);

    const { data } = await api.post(ENDPOINT, formData);
    return data;
  },

  update: async (payload: IImage): Promise<IImage> => {
    const formData = new FormData();
    formData.append("Id", String(payload.id));
    formData.append("Type", payload.type);
    formData.append("Name", payload.name);

    if (isImageDataUrl(payload.content)) {
      formData.append("File", dataUrlToFile(payload.content, payload.name));
    }

    const { data } = await api.put(ENDPOINT, formData);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`${ENDPOINT}/${id}`);
    return data;
  },
  getImageTypeEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/image-type`);
    return data;
  },
  getImageStatusEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/image-status`);
    return data;
  },
};
