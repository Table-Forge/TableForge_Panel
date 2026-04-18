import { createPortal } from "react-dom";
import { Filter } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/src/components/button/button";
import { useDropdownPosition } from "@/src/hooks/utils/useDropdownPosition";
import { FilterContext } from "./filters.context";
import type { IFilters } from "./filters.interfaces";

export const Filters: React.FC<IFilters> = ({ filters, align = "left" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const { listStyle, isSettling, prepareOpenPosition, resetDropdownPosition } =
    useDropdownPosition({
      triggerRef,
      listRef: filterRef,
      isOpen,
      watchDeps: [align],
      offsetTop: 8,
      horizontalAnchor: align === "right" ? "right" : "left",
      includeWidth: false,
    });

  const close = useCallback(() => {
    resetDropdownPosition();
    setIsOpen(false);
  }, [resetDropdownPosition]);

  const value = useMemo(() => ({ close }), [close]);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isOpen) {
      prepareOpenPosition();
    }

    setIsOpen((prev) => {
      const next = !prev;
      if (!next) resetDropdownPosition();
      return next;
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const isInsideFilter = filterRef.current?.contains(target);
      const isInsideTrigger = triggerRef.current?.contains(target);
      const isInsidePortal = (target as HTMLElement).closest?.(
        '[data-portal="true"]',
      );

      if (!isInsideFilter && !isInsideTrigger && !isInsidePortal) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close, isOpen]);

  return (
    <div className="relative">
      <div ref={triggerRef}>
        <Button
          type="button"
          size="sm"
          buttonStyle="primary"
          className="rounded-xl"
          onClick={handleToggle}
        >
          <Filter size={14} />
          Filtros
        </Button>
      </div>

      {typeof document !== "undefined" && isOpen
        ? createPortal(
            <FilterContext.Provider value={value}>
              <div
                ref={filterRef}
                data-portal="true"
                className="absolute z-[1200] w-[min(92vw,640px)] overflow-visible rounded-2xl border border-white/15 bg-primary shadow-2xl"
                style={{
                  top: `${listStyle.top}px`,
                  left: `${listStyle.left}px`,
                  opacity: isSettling ? 0 : 1,
                  pointerEvents: isSettling ? "none" : "auto",
                }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="max-h-[70vh] overflow-auto p-4">{filters}</div>
              </div>
            </FilterContext.Provider>,
            document.body,
          )
        : null}
    </div>
  );
};
