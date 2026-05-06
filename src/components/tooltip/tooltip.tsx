import React, { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type {
  TPortalPosition,
  TPortalResolverContext,
} from "@/src/hooks/utils/usePortalPosition";
import { usePortalPosition } from "@/src/hooks/utils/usePortalPosition";
import type { ITooltip } from "./tooltip.interfaces";

export const Tooltip: React.FC<ITooltip> = ({
  children,
  text,
  side = "bottom",
  forcePointer = false,
  ...props
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const gap = 8;

  const resolvePosition = useCallback(
    ({
      triggerRect,
      portalRect,
      viewportHeight,
      viewportWidth,
    }: TPortalResolverContext): TPortalPosition => {
      const tooltipWidth = portalRect?.width ?? 0;
      const tooltipHeight = portalRect?.height ?? 0;
      const margin = 8;
      const centeredLeft =
        triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;

      const clampLeft = (value: number) =>
        tooltipWidth > 0
          ? Math.min(
              Math.max(value, margin),
              Math.max(margin, viewportWidth - tooltipWidth - margin),
            )
          : value;

      const clampTop = (value: number) =>
        tooltipHeight > 0
          ? Math.min(
              Math.max(value, margin),
              Math.max(margin, viewportHeight - tooltipHeight - margin),
            )
          : value;

      const shouldOpenUp =
        triggerRect.bottom + gap + tooltipHeight > viewportHeight - margin &&
        triggerRect.top > viewportHeight - triggerRect.bottom;
      const shouldOpenDown =
        triggerRect.top - gap - tooltipHeight < margin &&
        viewportHeight - triggerRect.bottom > triggerRect.top;

      let top = triggerRect.top + triggerRect.height / 2;
      let left = centeredLeft;

      switch (side) {
        case "full-right":
          left = triggerRect.left + triggerRect.width + gap;
          top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
          break;
        case "right":
          left = triggerRect.left + triggerRect.width - 8;
          top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
          break;
        case "full-left":
          left = triggerRect.left - tooltipWidth - gap;
          top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
          break;
        case "left":
          left = triggerRect.left - tooltipWidth + 8;
          top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
          break;
        case "top":
          top = shouldOpenDown
            ? triggerRect.bottom + gap
            : triggerRect.top - tooltipHeight - gap;
          break;
        case "center":
          top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
          break;
        default:
          top = shouldOpenUp
            ? triggerRect.top - tooltipHeight - gap
            : triggerRect.bottom + gap;
          break;
      }

      return { top: clampTop(top), left: clampLeft(left) };
    },
    [gap, side],
  );

  const { position, prepareOpenPosition } = usePortalPosition({
    triggerRef: wrapperRef,
    portalRef: tooltipRef,
    isOpen: showTooltip,
    watchDeps: [side, text],
    resolvePosition,
  });

  const handleMouseEnter = () => {
    prepareOpenPosition();
    setShowTooltip(true);
  };

  const handleMouseLeave = () => setShowTooltip(false);

  const tooltipElement = (
    <div
      ref={tooltipRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className={`fixed z-[9999] max-w-[280px] rounded-lg border border-white/10 bg-primary px-2 py-1 text-xs text-white shadow-lg ${
        props.uppercase ? "uppercase" : "normal-case"
      }`}
      dangerouslySetInnerHTML={{ __html: String(text) }}
    />
  );

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex ${forcePointer ? "cursor-pointer" : "cursor-help"}`}
      style={props.style}
    >
      <div
        className={
          props.overflowed
            ? "w-full max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
            : ""
        }
      >
        {children}
      </div>
      {showTooltip && position.top !== 0 ? createPortal(tooltipElement, document.body) : null}
    </div>
  );
};
