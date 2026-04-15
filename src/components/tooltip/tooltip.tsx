import React, { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TPortalResolverContext } from "@/src/hooks/utils/usePortalPosition";
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
    ({ triggerRect }: TPortalResolverContext) => {
      let top = triggerRect.top + triggerRect.height / 2;
      let left = triggerRect.left + triggerRect.width / 2;

      switch (side) {
        case "full-right":
          left = triggerRect.left + triggerRect.width + gap;
          break;
        case "right":
          left = triggerRect.left + triggerRect.width - 8;
          break;
        case "full-left":
          left = triggerRect.left - gap;
          break;
        case "left":
          left = triggerRect.left - 8;
          break;
        case "top":
          top = triggerRect.top - gap;
          break;
        case "center":
          break;
        default:
          top = triggerRect.top + triggerRect.height + gap;
          break;
      }

      return { top, left };
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
      <div className={props.overflowed ? "max-w-full overflow-hidden text-ellipsis whitespace-nowrap" : ""}>
        {children}
      </div>
      {showTooltip && position.top !== 0 ? createPortal(tooltipElement, document.body) : null}
    </div>
  );
};
