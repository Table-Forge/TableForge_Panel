import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { api } from "@/src/features/api";
import type { IPaginatedResponse } from "@/src/interfaces";
import type {
  ISpace,
  ISpaceBooking,
  ISpaceBookingStatusUpdate,
  ISpaceCreate,
  ISpaceList,
  ISpaceTable,
  ISpaceTableCreate,
  ISpaceTableUpdate,
  ISpaceUpdate,
  IBookingChatMessage,
} from "../schemas/spaces.schema";

const ENDPOINT_SPACES = "/api/Spaces";
const ENDPOINT_TABLES = "/api/SpaceTables";
const ENDPOINT_BOOKINGS = "/api/SpaceBookings";

export const SpaceService = {
  // SPACES
  getAll: async (params: Record<string, unknown> = {}): Promise<IPaginatedResponse<ISpaceList>> => {
    const { enabled: _enabled, ...queryParams } = params;
    const { data } = await api.get<IPaginatedResponse<ISpaceList>>(ENDPOINT_SPACES, {
      params: queryParams,
    });
    return data;
  },

  getById: async (id: number): Promise<ISpace> => {
    const { data } = await api.get(`${ENDPOINT_SPACES}/${id}`);
    return data;
  },

  create: async (data: ISpaceCreate) => api.post(`${ENDPOINT_SPACES}`, data),
  update: async (params: { id: number; data: ISpaceUpdate }) =>
    api.put(`${ENDPOINT_SPACES}/${params.id}`, params.data),
  delete: async (id: number) => api.delete(`${ENDPOINT_SPACES}/${id}`),

  addImage: async (params: { spaceId: number; imageId: number }) =>
    api.post(`${ENDPOINT_SPACES}/${params.spaceId}/Images`, { imageId: params.imageId }),
  removeImage: async (params: { spaceId: number; imageId: number }) =>
    api.delete(`${ENDPOINT_SPACES}/${params.spaceId}/Images/${params.imageId}`),

  // ENUMS
  getSpaceStatusEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT_SPACES}/enums/space-status`);
    return data;
  },
  getTableShapeEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT_SPACES}/enums/table-shape`);
    return data;
  },
  getBookingStatusEnum: async (): Promise<TSelectOptions[]> => {
    const { data } = await api.get(`${ENDPOINT_BOOKINGS}/enums/booking-status`);
    return data;
  },

  // TABLES
  getTablesBySpaceId: async (spaceId: number, params: Record<string, unknown> = {}): Promise<ISpaceTable[]> => {
    const { enabled: _enabled, ...queryParams } = params;
    const { data } = await api.get(`${ENDPOINT_SPACES}/${spaceId}/Tables`, {
      params: queryParams,
    });
    return data;
  },
  getTableById: async (id: number): Promise<ISpaceTable> => {
    const { data } = await api.get(`${ENDPOINT_TABLES}/${id}`);
    return data;
  },
  createTable: async (params: { spaceId: number; data: ISpaceTableCreate }) => {
    return api.post(`${ENDPOINT_TABLES}`, { ...params.data, spaceId: params.spaceId });
  },
  updateTable: async (params: { id: number; data: ISpaceTableUpdate }) =>
    api.put(`${ENDPOINT_TABLES}/${params.id}`, params.data),
  deleteTable: async (id: number) => api.delete(`${ENDPOINT_TABLES}/${id}`),

  // BOOKINGS
  getBookings: async (params: Record<string, unknown> = {}): Promise<IPaginatedResponse<ISpaceBooking>> => {
    const { enabled: _enabled, ...queryParams } = params;
    const { data } = await api.get<IPaginatedResponse<ISpaceBooking>>(ENDPOINT_BOOKINGS, {
      params: queryParams,
    });
    return data;
  },
  updateBookingStatus: async (params: { id: number; data: ISpaceBookingStatusUpdate }) =>
    api.put(`${ENDPOINT_BOOKINGS}/${params.id}/Status`, params.data),

  // CHAT
  getBookingMessages: async (bookingId: number): Promise<IBookingChatMessage[]> => {
    const { data } = await api.get(`${ENDPOINT_BOOKINGS}/${bookingId}/Messages`);
    return data;
  },
  sendBookingMessage: async (params: { bookingId: number; content: string }) => {
    const { data } = await api.post(`${ENDPOINT_BOOKINGS}/${params.bookingId}/Messages`, { content: params.content });
    return data;
  },
};
