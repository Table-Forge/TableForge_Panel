import { useAuth } from "@/src/context/use-auth";
import { NOTIFICATION_KEYS } from "@/src/features/notifications/hooks/query-key";
import { NotificationService } from "@/src/features/notifications/services/notifications.services";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const NOTIFICATIONS_PAGE_SIZE = 10;

export const useNotifications = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const query = useInfiniteQuery({
    queryKey: NOTIFICATION_KEYS.list(userId),
    queryFn: ({ pageParam }) =>
      NotificationService.getByUser({
        userId: userId!,
        page: pageParam,
        size: NOTIFICATIONS_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedItems = allPages.reduce(
        (total, page) => total + page.items.length,
        0,
      );
      const totalItems = lastPage.pagination?.filteredItems ?? 0;

      return loadedItems < totalItems ? allPages.length + 1 : undefined;
    },
    enabled: !!userId,
  });

  const unreadQuery = useQuery({
    queryKey: NOTIFICATION_KEYS.unread(userId),
    queryFn: () =>
      NotificationService.getByUser({
        userId: userId!,
        page: 1,
        size: 1,
        read: false,
      }),
    enabled: !!userId,
  });

  return {
    ...query,
    notifications: query.data?.pages.flatMap((page) => page.items) ?? [],
    unreadCount: unreadQuery.data?.pagination?.filteredItems ?? 0,
  };
};
