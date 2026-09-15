import { api } from "@/src/features/api";
import { type IGetPaginatedParams, type IPaginatedResponse } from "@/src/interfaces";
import {
  type ITermsAcceptanceList,
  type ITermsDocument,
  type ITermsDocumentList,
} from "../schemas/terms.schema";

const ENDPOINT = "/api/Terms";

export interface IGetTermsParams extends IGetPaginatedParams {
  audience?: string;
  status?: string;
  search?: string;
}

export const TermsService = {
  getPaginated: async (
    params: IGetTermsParams = {},
  ): Promise<IPaginatedResponse<ITermsDocumentList>> => {
    const { data } = await api.get(ENDPOINT, { params });
    return data;
  },

  getById: async (id: number): Promise<ITermsDocument> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);
    return data;
  },

  getAcceptances: async (
    id: number,
    page: number = 1,
    size: number = 20,
  ): Promise<IPaginatedResponse<ITermsAcceptanceList>> => {
    const { data } = await api.get(`${ENDPOINT}/${id}/Acceptances`, {
      params: { page, size },
    });
    return data;
  },

  create: async (formData: FormData): Promise<ITermsDocument> => {
    const { data } = await api.post(ENDPOINT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  update: async (id: number, formData: FormData): Promise<ITermsDocument> => {
    const { data } = await api.put(`${ENDPOINT}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  approve: async (id: number): Promise<ITermsDocument> => {
    const { data } = await api.put(`${ENDPOINT}/${id}/Approve`);
    return data;
  },

  deprecate: async (id: number): Promise<ITermsDocument> => {
    const { data } = await api.put(`${ENDPOINT}/${id}/Deprecate`);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${ENDPOINT}/${id}`);
  },

  getAudienceEnum: async (): Promise<
    { id: number; value: string; name: string; allowSelect?: boolean }[]
  > => {
    const { data } = await api.get(`${ENDPOINT}/enums/terms-audience`);
    return data;
  },

  getStatusEnum: async (): Promise<
    { id: number; value: string; name: string; allowSelect?: boolean }[]
  > => {
    const { data } = await api.get(`${ENDPOINT}/enums/terms-status`);
    return data;
  },
};
