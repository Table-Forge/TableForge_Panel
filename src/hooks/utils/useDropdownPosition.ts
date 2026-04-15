import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

export type TDropdownDirection = "up" | "down";

type TDropdownStyle = {
  top: number;
  left: number;
  width: number;
};

type TUseDropdownPositionParams = {
  triggerRef: RefObject<HTMLElement | null>;
  listRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  watchDeps?: ReadonlyArray<unknown>;
  openUpThreshold?: number;
  margin?: number;
  offsetTop?: number;
  offsetLeft?: number;
  widthOffset?: number;
  horizontalAnchor?: "left" | "right";
  includeWidth?: boolean;
  hideBodyOverflowOnSettle?: boolean;
};

const DEFAULT_OPEN_UP_THRESHOLD = 0.8;
const DEFAULT_MARGIN = 8;

let bodyOverflowLockCount = 0;
let previousBodyOverflow: string | null = null;

const lockBodyOverflow = () => {
  if (typeof document === "undefined") return;

  if (bodyOverflowLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow || "";
    document.body.style.overflow = "hidden";
  }

  bodyOverflowLockCount += 1;
};

const unlockBodyOverflow = () => {
  if (typeof document === "undefined") return;
  if (bodyOverflowLockCount <= 0) return;

  bodyOverflowLockCount -= 1;

  if (bodyOverflowLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow ?? "";
    previousBodyOverflow = null;
  }
};

export const useDropdownPosition = ({
  triggerRef,
  listRef,
  isOpen,
  watchDeps = [],
  openUpThreshold = DEFAULT_OPEN_UP_THRESHOLD,
  margin = DEFAULT_MARGIN,
  offsetTop = 0,
  offsetLeft = 0,
  widthOffset = 0,
  horizontalAnchor = "left",
  includeWidth = true,
  hideBodyOverflowOnSettle = true,
}: TUseDropdownPositionParams) => {
  const [listStyle, setListStyle] = useState<TDropdownStyle>({
    top: 0,
    left: 0,
    width: 0,
  });
  const [listDirection, setListDirection] = useState<TDropdownDirection>("down");
  const [isSettling, setIsSettling] = useState(false);
  const settlingRef = useRef(false);

  const calculatePosition = useCallback(
    (preferredDirection?: TDropdownDirection, listHeightOverride?: number) => {
      if (!triggerRef.current) return null;

      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;

      const preferredByThreshold =
        rect.top / Math.max(viewportHeight, 1) >= openUpThreshold ? "up" : "down";

      let direction = preferredDirection || preferredByThreshold;

      const listHeight =
        typeof listHeightOverride === "number"
          ? listHeightOverride
          : listRef.current?.getBoundingClientRect().height || 0;
      const listWidth = listRef.current?.getBoundingClientRect().width || 0;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (listHeight > 0) {
        if (
          direction === "down" &&
          spaceBelow < listHeight + margin &&
          spaceAbove > spaceBelow
        ) {
          direction = "up";
        }

        if (
          direction === "up" &&
          spaceAbove < listHeight + margin &&
          spaceBelow > spaceAbove
        ) {
          direction = "down";
        }
      }

      const rawTop =
        direction === "up"
          ? rect.top + offsetTop + scrollY - listHeight
          : rect.top + offsetTop + scrollY + rect.height;

      const minTop = scrollY + margin;
      const maxTop = scrollY + viewportHeight - listHeight - margin;
      const top =
        listHeight > 0
          ? Math.min(Math.max(rawTop, minTop), Math.max(minTop, maxTop))
          : rawTop;

      const fallbackWidth = rect.width + widthOffset;
      const width = includeWidth
        ? fallbackWidth
        : listWidth > 0
          ? listWidth
          : fallbackWidth;
      const left =
        horizontalAnchor === "right"
          ? rect.right + offsetLeft + scrollX - width
          : rect.left + offsetLeft + scrollX;

      return {
        direction,
        hasMeasuredPortal: listHeight > 0,
        style: {
          top,
          left,
          width,
        },
      };
    },
    [
      horizontalAnchor,
      includeWidth,
      listRef,
      margin,
      offsetLeft,
      offsetTop,
      openUpThreshold,
      triggerRef,
      widthOffset,
    ],
  );

  const applyPosition = useCallback(
    (preferredDirection?: TDropdownDirection, listHeightOverride?: number) => {
      const next = calculatePosition(preferredDirection, listHeightOverride);
      if (!next) return;

      setListDirection((previous) =>
        previous === next.direction ? previous : next.direction,
      );

      setListStyle((previous) => {
        if (
          previous.top === next.style.top &&
          previous.left === next.style.left &&
          previous.width === next.style.width
        ) {
          return previous;
        }

        return next.style;
      });

      if (settlingRef.current && next.hasMeasuredPortal) {
        settlingRef.current = false;
        setIsSettling(false);
      }
    },
    [calculatePosition],
  );

  const prepareOpenPosition = useCallback(() => {
    settlingRef.current = true;
    setIsSettling(true);
    applyPosition(undefined, 0);
  }, [applyPosition]);

  const resetDropdownPosition = useCallback(() => {
    settlingRef.current = false;
    setIsSettling(false);
    setListDirection("down");
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const frameId = requestAnimationFrame(() => {
      applyPosition(listDirection);
    });

    return () => cancelAnimationFrame(frameId);
  }, [applyPosition, isOpen, listDirection, ...watchDeps]);

  useEffect(() => {
    if (!isOpen) return;

    const handleViewportChange = () => {
      applyPosition();
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [applyPosition, isOpen]);

  useEffect(() => {
    const shouldLockBody = hideBodyOverflowOnSettle && isOpen && isSettling;
    if (!shouldLockBody) return;

    lockBodyOverflow();
    return () => unlockBodyOverflow();
  }, [hideBodyOverflowOnSettle, isOpen, isSettling]);

  return {
    listStyle,
    listDirection,
    isSettling,
    prepareOpenPosition,
    resetDropdownPosition,
  };
};
