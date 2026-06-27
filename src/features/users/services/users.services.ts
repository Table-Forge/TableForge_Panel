import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { api } from "@/src/features/api";
import {
  type IUpdatePassword,
  type IUser,
} from "@/src/features/users/schemas/user.schema";
import { dataUrlToCompressedFile } from "@/src/utils/image";
import type { IGetAllUsersResponse, IGetUsers } from "../hooks/types";

const ENDPOINT = "/users";

export const UserService = {
  getAll: async (params: IGetUsers = {}): Promise<IGetAllUsersResponse> => {
    const { enabled: _enabled, ...queryParams } = params;
    const { data } = await api.get<IGetAllUsersResponse>(ENDPOINT, {
      params: queryParams,
    });
    return data;
  },

  getById: async (id: number): Promise<IUser> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);
    return data;
  },

  create: async (data: IUser) => api.post(`${ENDPOINT}`, data),
  update: async (data: IUser) => api.put(`${ENDPOINT}`, data),
  delete: async (id: number) => api.delete(`${ENDPOINT}/${id}`),
  updateAvatar: async (data: { id: number; content: string }) => {
    const formData = new FormData();
    formData.append("Id", String(data.id));
    formData.append("File", await dataUrlToCompressedFile(data.content, `avatar-${data.id}`));

    return api.put(`${ENDPOINT}/avatar`, formData);
  },
  removeAvatar: async (userId: number) =>
    api.delete(`${ENDPOINT}/${userId}/avatar/moderate`),

  updatePassword: async (params: IUpdatePassword) => {
    const { data } = await api.put(
      `${ENDPOINT}/password/${params.userId}`,
      null,
      {
        params: {
          currentPassword: params.currentPassword,
          newPassword: params.newPassword,
        },
      },
    );
    return data;
  },

  getGenderEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/user-gender`);
    return data;
  },
  getStatusEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/user-status`);
    return data;
  },
  getDeliveryMethodEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/delivery-method`);
    return data;
  },
  getTypeEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/user-type`);
    return data;
  },
};
