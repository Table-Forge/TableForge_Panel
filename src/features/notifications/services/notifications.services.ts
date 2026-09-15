import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { api } from "@/src/features/api";
import type { INotification } from "@/src/features/notifications/schemas/notification.schema";
import type { IGetPaginatedParams, IPaginatedResponse } from "@/src/interfaces";

const ENDPOINT = "/api/Notifications";

type IGetByUserParams = IGetPaginatedParams & {
  userId: number;
  read?: boolean;
};

export const NotificationService = {
  getByUser: async ({
    userId,
    page,
    size,
    read,
  }: IGetByUserParams): Promise<IPaginatedResponse<INotification>> => {
    const { data } = await api.get(`${ENDPOINT}/user/${userId}`, {
      params: { page, size, read },
    });
    return data;
  },

  markAsRead: async (id: number): Promise<INotification> => {
    const { data } = await api.put(`${ENDPOINT}/${id}/read`);
    return data;
  },

  markAllAsRead: async (userId: number) => {
    const { data } = await api.put(`${ENDPOINT}/user/${userId}/read-all`);
    return data;
  },

  getTypeEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/notification-type`);
    return data;
  },
};
