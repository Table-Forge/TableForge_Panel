import { api } from "@/src/features/api";
import type { IEvent, IEventCreate } from "../schemas/events.schema";
import { type IGetPaginatedParams, type IPaginatedResponse } from "@/src/interfaces";

const ENDPOINT = "/api/Events";

export interface IGetEventsParams extends IGetPaginatedParams {
  search?: string;
  tags?: string;
  isOnline?: boolean;
  isFree?: boolean;
  organizerId?: number;
  spaceId?: number;
  status?: string;
  onlyUpcoming?: boolean;
}

export const EventService = {
  getPaginated: async (params: IGetEventsParams = {}): Promise<IPaginatedResponse<IEvent>> => {
    const { data } = await api.get(ENDPOINT, { params });
    return data;
  },

  getById: async (id: number): Promise<IEvent> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);
    return data;
  },

  create: async (payload: IEventCreate): Promise<IEvent> => {
    const { data } = await api.post(ENDPOINT, payload);
    return data;
  },

  update: async (id: number, payload: IEventCreate): Promise<IEvent> => {
    const { data } = await api.put(`${ENDPOINT}/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${ENDPOINT}/${id}`);
  },

  getEnum: async (enumName: string): Promise<{ id: number; value: string; name: string; allowSelect?: boolean }[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/${enumName}`);
    return data;
  },
};
