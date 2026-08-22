import { useQuery } from "@tanstack/react-query";
import { USER_FEEDBACKS_KEYS } from "./query-keys";
import { UserFeedbackService } from "../services/user-feedbacks.services";
import type { IUserFeedbackFilters } from "../interfaces";

export const useUserFeedbacksQuery = (filters: IUserFeedbackFilters) => {
  return useQuery({
    queryKey: USER_FEEDBACKS_KEYS.list(filters),
    queryFn: () => UserFeedbackService.getAll(filters),
  });
};

export const useUserFeedbackDetailsQuery = (id: number) => {
  return useQuery({
    queryKey: USER_FEEDBACKS_KEYS.detail(id),
    queryFn: () => UserFeedbackService.getById(id),
    enabled: !!id,
  });
};

export const useUserFeedbackSummaryQuery = (from?: string, to?: string) => {
  return useQuery({
    queryKey: USER_FEEDBACKS_KEYS.summary(from, to),
    queryFn: () => UserFeedbackService.getSummary(from, to),
  });
};
