import { api } from "@/src/features/api";
import type { IPaginatedResponse } from "@/src/interfaces";
import type {
  IUserFeedback,
  IUserFeedbackFilters,
  IUserFeedbackListDto,
  IUserFeedbackSummary,
} from "../interfaces";
import type { IUserFeedbackStatusUpdate } from "../schemas/user-feedback.schema";

const CONTROLLER = "/api/UserFeedbacks";

export class UserFeedbackService {
  static async getAll(
    filters: IUserFeedbackFilters
  ): Promise<IPaginatedResponse<IUserFeedbackListDto>> {
    const { data } = await api.get<IPaginatedResponse<IUserFeedbackListDto>>(
      CONTROLLER,
      { params: filters }
    );
    return data;
  }

  static async getById(id: number): Promise<IUserFeedback> {
    const { data } = await api.get<IUserFeedback>(`${CONTROLLER}/${id}`);
    return data;
  }

  static async updateStatus(
    id: number,
    payload: IUserFeedbackStatusUpdate
  ): Promise<void> {
    await api.put(`${CONTROLLER}/${id}/Status`, payload);
  }

  static async getSummary(from?: string, to?: string): Promise<IUserFeedbackSummary> {
    const { data } = await api.get<IUserFeedbackSummary>(`${CONTROLLER}/summary`, {
      params: { from, to },
    });
    return data;
  }
}
