import { api } from "@/src/features/api";
import {
  UserSchema,
  type IUpdatePassword,
  type IUser,
  type IUserUpdateOutput,
} from "@/src/features/users/schemas/user.schema";

const ENDPOINT = "/users";

export const UserService = {
  getAll: async (): Promise<IUser[]> => {
    const { data } = await api.get(`${ENDPOINT}`);

    return data;
  },

  getById: async (id: number): Promise<IUser> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);
    const payload =
      !Array.isArray(data) && data && typeof data === "object"
        ? ((data as Record<string, unknown>).data ?? data)
        : data;

    return UserSchema.parse(payload);
  },

  create: async (params: Partial<IUser>) => {
    const { data } = await api.post(`${ENDPOINT}`, params);
    return data;
  },

  update: async (payload: IUserUpdateOutput) => {
    const { data } = await api.put(`${ENDPOINT}`, payload);
    return data;
  },

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
