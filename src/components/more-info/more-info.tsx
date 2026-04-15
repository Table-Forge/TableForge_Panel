import { Ellipsis } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { useDropdownPosition } from "@/src/hooks/utils/useDropdownPosition";
import type { IMoreInfo } from "./more-info.interfaces";

export const MoreInfo: React.FC<IMoreInfo> = ({
  options,
  boxSide = "bottom",
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fullRightCoords, setFullRightCoords] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isFullRight = boxSide === "full-right";

  const updateFullRightCoords = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    setFullRightCoords({
      top: rect.top + window.scrollY + rect.height / 2,
      left: rect.right + window.scrollX + 14,
    });
  }, []);

  const { listStyle, isSettling, prepareOpenPosition, resetDropdownPosition } =
    useDropdownPosition({
      triggerRef,
      listRef: menuRef,
      isOpen: isOpen && !isFullRight,
      watchDeps: [boxSide, options?.length || 0],
      offsetTop: 8,
      offsetLeft: boxSide === "right" ? 8 : 0,
      horizontalAnchor: boxSide === "right" ? "right" : "left",
      includeWidth: false,
    });

  const handleToggle = (event: ReactMouseEvent) => {
    if (!options || options.length === 0) return;

    event.stopPropagation();

    if (!isOpen) {
      if (isFullRight) {
        updateFullRightCoords();
      } else {
        prepareOpenPosition();
      }
    }

    setIsOpen((current) => {
      const next = !current;
      if (!next) resetDropdownPosition();
      return next;
    });
  };

  useEffect(() => {
    if (!isOpen || !isFullRight) return;

    const frameId = requestAnimationFrame(() => {
      updateFullRightCoords();
    });

    const handleViewportChange = () => {
      updateFullRightCoords();
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isFullRight, isOpen, updateFullRightCoords]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
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

  if (!options || options.length === 0) return null;

  const menuCoords = isFullRight
    ? fullRightCoords
    : { top: listStyle.top, left: listStyle.left };

  const menu = (
    <div
      ref={menuRef}
      className="absolute z-[9999] min-w-max rounded-xl border border-white/15 bg-primary shadow-2xl"
      style={{
        top: menuCoords.top,
        left: menuCoords.left,
        transform: boxSide === "full-right" ? "translateY(-50%)" : undefined,
        opacity: !isFullRight && isSettling ? 0 : 1,
        pointerEvents: !isFullRight && isSettling ? "none" : "auto",
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        className="pointer-events-none absolute h-4 w-4 rotate-45 border-l border-t border-white/15 bg-primary"
        style={
          boxSide === "full-right"
            ? { top: "calc(50% - 8px)", left: -8 }
            : { top: -8, right: boxSide === "right" ? 12 : 40 }
        }
      />

      {options.map((opt, index) => (
        <button
          key={`${opt.label}-${index}`}
          type="button"
          onClick={() => {
            opt.onClick();
            setIsOpen(false);
          }}
          className="flex h-10 w-full items-center gap-1 px-4 text-left text-xs font-medium text-grays-100 opacity-80 transition hover:bg-white/10 hover:opacity-100"
        >
          {opt.icon ? (
            <span className="flex h-4 w-4 items-center">{opt.icon}</span>
          ) : null}
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative flex items-center justify-center">
      <div
        ref={triggerRef}
        onClick={handleToggle}
        className={options.length > 0 ? "cursor-pointer" : "cursor-default"}
      >
        {children ?? (
          <button
            type="button"
            aria-label="Mais opções"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition ${
              isOpen
                ? "border-secondary/40 bg-secondary/15 text-white"
                : "border-white/10 bg-primary/80 text-grays-100 hover:border-secondary/30 hover:text-white"
            }`}
          >
            <Ellipsis size={18} />
          </button>
        )}
      </div>

      {typeof document !== "undefined" && menuCoords.top !== 0
        ? createPortal(isOpen ? menu : null, document.body)
        : null}
    </div>
  );
};
