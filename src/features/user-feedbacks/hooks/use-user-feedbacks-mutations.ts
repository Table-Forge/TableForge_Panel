import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/src/context/use-auth";
import { USER_FEEDBACKS_KEYS } from "./query-keys";
import { UserFeedbackService } from "../services/user-feedbacks.services";
import type { IUserFeedbackStatusUpdate } from "../schemas/user-feedback.schema";
import type {
  IUserFeedback,
  IUserFeedbackMessage,
  IUserFeedbackSendMessage,
} from "../interfaces";

export const useUserFeedbacksMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
    onMutate: async ({ id, payload }) => {
      const detailKey = USER_FEEDBACKS_KEYS.detail(id);
      await queryClient.cancelQueries({ queryKey: detailKey });
      const previousFeedback = queryClient.getQueryData<IUserFeedback>(detailKey);

      const tempId = -(Date.now() * 1000 + Math.floor(Math.random() * 1000));
      const optimisticMessage: IUserFeedbackMessage = {
        id: tempId,
        feedbackId: id,
        createdAt: new Date().toISOString(),
        userId: user?.id,
        userName: user?.nickname || user?.username || "Equipe TableForge",
        userAvatarUrl: user?.avatarUrl || undefined,
        isFromTeam: true,
        content: payload.content,
        images: [],
        isOptimistic: true,
      };

      if (previousFeedback) {
        queryClient.setQueryData<IUserFeedback>(detailKey, {
          ...previousFeedback,
          messages: [...(previousFeedback.messages || []), optimisticMessage],
        });
      }

      return { previousFeedback, id };
    },
    onError: (_error: unknown, { id }, context) => {
      if (context?.previousFeedback) {
        queryClient.setQueryData(USER_FEEDBACKS_KEYS.detail(id), context.previousFeedback);
      }
    },
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

