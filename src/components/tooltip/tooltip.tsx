import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ITooltip } from "./tooltip.interfaces";

export const Tooltip: React.FC<ITooltip> = ({
  children,
  text,
  side = "bottom",
  forcePointer = false,
  ...props
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const gap = 8;

  const handleMouseEnter = () => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    let top = rect.top + rect.height / 2;
    let left = rect.left + rect.width / 2;

    switch (side) {
      case "full-right":
        left = rect.left + rect.width + gap;
        break;
      case "right":
        left = rect.left + rect.width - 8;
        break;
      case "full-left":
        left = rect.left - gap;
        break;
      case "left":
        left = rect.left - 8;
        break;
      case "top":
        top = rect.top - gap;
        break;
      case "center":
        break;
      default:
        top = rect.top + rect.height + gap;
        break;
    }

    setPosition({ top, left });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => setShowTooltip(false);

  useEffect(() => {
    if (!showTooltip) return;
    window.addEventListener("scroll", handleMouseLeave, true);
    return () => window.removeEventListener("scroll", handleMouseLeave, true);
  }, [showTooltip]);

  const tooltipElement = (
    <div
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
