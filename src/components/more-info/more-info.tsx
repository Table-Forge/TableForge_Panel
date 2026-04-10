import { Ellipsis } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import type { IMoreInfo } from "./more-info.interfaces";

export const MoreInfo: React.FC<IMoreInfo> = ({
  options,
  boxSide = "bottom",
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateCoords = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    let top = rect.bottom + window.scrollY + 8;
    let left = rect.left + window.scrollX;

    if (boxSide === "right") {
      const menuWidth = menuRef.current?.offsetWidth ?? 180;
      left = rect.right + window.scrollX - menuWidth + 8;
    }

    if (boxSide === "full-right") {
      top = rect.top + window.scrollY + rect.height / 2;
      left = rect.right + window.scrollX + 14;
    }

    setCoords({ top, left });
  };

  const handleToggle = (event: ReactMouseEvent) => {
    if (!options || options.length === 0) return;

    event.stopPropagation();
    updateCoords();
    setIsOpen((current) => !current);
  };

  useEffect(() => {
    if (!isOpen) return;

    const frameId = window.requestAnimationFrame(() => {
      updateCoords();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [boxSide, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => setIsOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  if (!options || options.length === 0) return null;

  const menu = (
    <div
      ref={menuRef}
      className="fixed z-[9999] min-w-max rounded-xl border border-white/15 bg-primary shadow-2xl"
      style={{
        top: coords.top,
        left: coords.left,
        transform: boxSide === "full-right" ? "translateY(-50%)" : undefined,
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
          className="flex h-10 w-full items-center gap-1 px-4 text-left text-xs font-medium uppercase text-grays-100 opacity-80 transition hover:bg-white/10 hover:opacity-100"
        >
          {opt.icon ? <span className="flex h-4 w-4 items-center">{opt.icon}</span> : null}
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

      {typeof document !== "undefined" && coords.top !== 0
        ? createPortal(isOpen ? menu : null, document.body)
        : null}
    </div>
  );
};
