import { ButtonIcon } from "@/src/components/button-icon/button-icon";
import { useAuth } from "@/src/context/use-auth";
import { useNotifications } from "@/src/features/notifications/hooks/use-notifications";
import { useNotificationsMutation } from "@/src/features/notifications/hooks/use-notifications-mutations";
import type { INotification } from "@/src/features/notifications/schemas/notification.schema";
import { useDropdownPosition } from "@/src/hooks/utils/useDropdownPosition";
import { formatDate } from "@/src/utils/format";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState, type UIEvent } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

const NAVIGABLE_LINKS = [/^\/user-feedbacks\/\d+$/, /^\/campaigns\/\d+$/];

const SCROLL_THRESHOLD = 48;

const resolvePanelRoute = (relatedLink?: string | null) => {
  if (!relatedLink) return null;

  return NAVIGABLE_LINKS.some((pattern) => pattern.test(relatedLink))
    ? relatedLink
    : null;
};

export const NotificationsBell = () => {
  const [isOpen, setIsOpen] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useNotifications();
  const { markAsReadMutation, markAllAsReadMutation } =
    useNotificationsMutation();

  const { listStyle, isSettling, prepareOpenPosition, resetDropdownPosition } =
    useDropdownPosition({
      triggerRef,
      listRef: panelRef,
      isOpen,
      watchDeps: [notifications.length],
      offsetTop: 8,
      horizontalAnchor: "right",
      includeWidth: false,
    });

  const closePanel = () => {
    resetDropdownPosition();
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!isOpen) prepareOpenPosition();

    setIsOpen((current) => {
      const next = !current;
      if (!next) resetDropdownPosition();
      return next;
    });
  };

  const handleSelect = (notification: INotification) => {
    if (!notification.read) markAsReadMutation.mutate(notification.id);

    const route = resolvePanelRoute(notification.relatedLink);
    if (!route) return;

    closePanel();
    navigate(route);
  };

  const handleMarkAllAsRead = () => {
    if (!user?.id) return;
    markAllAsReadMutation.mutate(user.id);
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop - clientHeight > SCROLL_THRESHOLD) return;

    fetchNextPage();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        resetDropdownPosition();
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, resetDropdownPosition]);

  const panel = (
    <div
      ref={panelRef}
      className="absolute z-[9999] w-[360px] overflow-hidden chamfer-md border border-white/15 bg-surface"
      style={{
        top: listStyle.top,
        left: listStyle.left,
        opacity: isSettling ? 0 : 1,
        pointerEvents: isSettling ? "none" : "auto",
      }}
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-card px-4 py-3">
        <p className="font-display text-sm font-bold uppercase tracking-[0.06em] text-white">
          Notificações
        </p>

        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
            className="cursor-pointer text-xs font-medium text-secondary transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Marcar todas como lidas
          </button>
        ) : null}
      </div>

      <div className="max-h-[420px] overflow-y-auto" onScroll={handleScroll}>
        {isLoading ? (
          <p className="px-4 py-6 text-center text-sm text-grays-100">
            Carregando...
          </p>
        ) : notifications.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-grays-100">
            Nenhuma notificação por aqui.
          </p>
        ) : (
          notifications.map((notification) => {
            const isNavigable = !!resolvePanelRoute(notification.relatedLink);

            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleSelect(notification)}
                className={`flex w-full gap-3 border-b border-white/5 px-4 py-3 text-left transition last:border-b-0 hover:bg-white/5 ${
                  isNavigable ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    notification.read ? "bg-transparent" : "bg-secondary"
                  }`}
                />

                <span className="flex-1">
                  <span
                    className={`block text-sm ${
                      notification.read
                        ? "text-grays-100"
                        : "font-medium text-white"
                    }`}
                  >
                    {notification.message}
                  </span>

                  {notification.createdAt ? (
                    <span className="mt-1 block text-[11px] text-grays-200">
                      {formatDate(notification.createdAt, true)}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })
        )}

        {isFetchingNextPage ? (
          <p className="px-4 py-3 text-center text-xs text-grays-200">
            Carregando mais...
          </p>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="relative flex items-center justify-center">
      <div ref={triggerRef}>
        <ButtonIcon
          aria-label="Notificações"
          hasHoverEffect
          isActive={isOpen}
          isHighlighted={isOpen}
          size="36px"
          onClick={handleToggle}
          className={`border ${
            isOpen
              ? "border-secondary/40 text-white"
              : "border-white/10 bg-white/5 hover:border-secondary/30 hover:text-white"
          }`}
        >
          <Bell size={18} />
        </ButtonIcon>
      </div>

      {unreadCount > 0 ? (
        <span className="pointer-events-none absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-on-accent ring-2 ring-background">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null}

      {typeof document !== "undefined"
        ? createPortal(isOpen ? panel : null, document.body)
        : null}
    </div>
  );
};
