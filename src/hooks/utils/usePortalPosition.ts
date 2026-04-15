import { type RefObject, useCallback, useEffect, useState } from "react";

export type TPortalPosition = {
  top: number;
  left?: number;
  right?: number;
  width?: number;
};

export type TPortalResolverContext = {
  triggerRect: DOMRect;
  portalRect: DOMRect | null;
  scrollX: number;
  scrollY: number;
  viewportWidth: number;
  viewportHeight: number;
};

type TUsePortalPositionParams = {
  triggerRef: RefObject<HTMLElement | null>;
  portalRef?: RefObject<HTMLElement | null>;
  isOpen: boolean;
  watchDeps?: ReadonlyArray<unknown>;
  resolvePosition: (context: TPortalResolverContext) => TPortalPosition;
};

export const usePortalPosition = ({
  triggerRef,
  portalRef,
  isOpen,
  watchDeps = [],
  resolvePosition,
}: TUsePortalPositionParams) => {
  const [position, setPosition] = useState<TPortalPosition>({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const portalRect = portalRef?.current?.getBoundingClientRect() || null;
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    const next = resolvePosition({
      triggerRect,
      portalRect,
      scrollX,
      scrollY,
      viewportWidth,
      viewportHeight,
    });

    setPosition((previous) => {
      if (
        previous.top === next.top &&
        previous.left === next.left &&
        previous.right === next.right &&
        previous.width === next.width
      ) {
        return previous;
      }

      return next;
    });
  }, [portalRef, resolvePosition, triggerRef]);

  const prepareOpenPosition = useCallback(() => {
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const frameId = requestAnimationFrame(() => {
      updatePosition();
    });

    return () => cancelAnimationFrame(frameId);
  }, [isOpen, updatePosition, ...watchDeps]);

  useEffect(() => {
    if (!isOpen) return;

    const handleViewportChange = () => {
      updatePosition();
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isOpen, updatePosition]);

  return {
    position,
    updatePosition,
    prepareOpenPosition,
  };
};
