import { api } from "@/src/features/api";
import {
  type IUpdatePassword,
  type IUser,
} from "@/src/features/users/schemas/user.schema";
import type { IGetAllUsersResponse, IGetUsers } from "../hooks/types";

const ENDPOINT = "/users";

export const UserService = {
  getAll: async (params: IGetUsers = {}): Promise<IGetAllUsersResponse> => {
    const { enabled: _enabled, ...queryParams } = params;
    const { data } = await api.get(ENDPOINT, {
      params: queryParams,
    });
    return data;
  },

  getById: async (id: number): Promise<IUser> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);
    return data;
  },

  create: async (data: IUser) => api.post(`${ENDPOINT}`, data),
  update: async (data: IUser) => api.put(`${ENDPOINT}/${data.id}`, data),
  delete: async (id: number) => api.delete(`${ENDPOINT}/${id}`),

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
};
