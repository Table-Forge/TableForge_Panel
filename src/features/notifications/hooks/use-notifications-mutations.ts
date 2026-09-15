import { NOTIFICATION_KEYS } from "@/src/features/notifications/hooks/query-key";
import type { INotification } from "@/src/features/notifications/schemas/notification.schema";
import { NotificationService } from "@/src/features/notifications/services/notifications.services";
import type { IPaginatedResponse } from "@/src/interfaces";
import { useBoundStore } from "@/src/store/use-bound-store";
import { handleError } from "@/src/utils/error-handler";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

export const useNotificationsMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useBoundStore((state) => state.addToast);

  const patchLists = (
    updater: (notification: INotification) => INotification,
  ) => {
    queryClient.setQueriesData<InfiniteData<IPaginatedResponse<INotification>>>(
      { queryKey: NOTIFICATION_KEYS.lists() },
      (oldData) =>
        oldData && {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map(updater),
          })),
        },
    );
  };

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => NotificationService.markAsRead(id),
    onSuccess: (_data, id) => {
      patchLists((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      );
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unreads() });
    },
    onError: (error: Error) => handleError(error),
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: (userId: number) => NotificationService.markAllAsRead(userId),
    onSuccess: () => {
      patchLists((notification) => ({ ...notification, read: true }));
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unreads() });
      addToast("success", "Todas as notificações foram marcadas como lidas!");
    },
    onError: (error: Error) => handleError(error),
  });

  return {
    markAsReadMutation,
    markAllAsReadMutation,
    isPending: markAsReadMutation.isPending || markAllAsReadMutation.isPending,
  };
};
