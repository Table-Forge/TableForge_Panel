import { useCallback, useEffect, useState } from "react";

export function useNewMessagesNotice(
  totalMessages: number,
  isAtBottom: boolean,
) {
  const [seenCount, setSeenCount] = useState(totalMessages);

  useEffect(() => {
    if (isAtBottom) setSeenCount(totalMessages);
  }, [isAtBottom, totalMessages]);

  const markAllSeen = useCallback(
    () => setSeenCount(totalMessages),
    [totalMessages],
  );

  return {
    pendingCount: Math.max(0, totalMessages - seenCount),
    markAllSeen,
  };
}
