import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USER_FEEDBACKS_KEYS } from "./query-keys";
import { UserFeedbackService } from "../services/user-feedbacks.services";
import type { IUserFeedbackStatusUpdate } from "../schemas/user-feedback.schema";

export const useUserFeedbacksMutations = () => {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IUserFeedbackStatusUpdate }) =>
      UserFeedbackService.updateStatus(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: USER_FEEDBACKS_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: USER_FEEDBACKS_KEYS.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: USER_FEEDBACKS_KEYS.summaries(),
      });
    },
  });

  return {
    updateStatusMutation,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};
