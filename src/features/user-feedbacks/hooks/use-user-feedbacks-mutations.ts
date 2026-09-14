import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USER_FEEDBACKS_KEYS } from "./query-keys";
import { UserFeedbackService } from "../services/user-feedbacks.services";
import type { IUserFeedbackStatusUpdate } from "../schemas/user-feedback.schema";
import type { IUserFeedbackSendMessage } from "../interfaces";

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

  const sendMessageMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IUserFeedbackSendMessage }) =>
      UserFeedbackService.sendMessage(id, payload),
    onSuccess: (updatedFeedback, { id }) => {
      queryClient.setQueryData(USER_FEEDBACKS_KEYS.detail(id), updatedFeedback);
      queryClient.invalidateQueries({
        queryKey: USER_FEEDBACKS_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: USER_FEEDBACKS_KEYS.summaries(),
      });
    },
  });

  return {
    updateStatusMutation,
    isUpdatingStatus: updateStatusMutation.isPending,
    sendMessageMutation,
    isSendingMessage: sendMessageMutation.isPending,
  };
};

