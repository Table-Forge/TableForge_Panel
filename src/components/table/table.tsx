import { createPortal } from "react-dom";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type MouseEvent,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { MdDragIndicator } from "react-icons/md";
import { Tooltip } from "@/src/components/tooltip/tooltip";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";
import type { ITable, TableRowProps } from "./table.interfaces";

export function Table<T extends { id?: number | string }>({
  tableContents,
  bodyData,
  detailsLink,
  bodyHeight,
  scrollable = true,
  emptyMessage,
  getRowColor,
  getContextOptions,
  isDraggable,
  onReorder,
}: ITable<T>) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    options: IMoreOptions[];
  } | null>(null);

  const canDrag = isDraggable ?? Boolean(onReorder);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleContainerDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (draggedIndex === null || !canDrag || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const threshold = 60;
      const topDistance = event.clientY - rect.top;
      const bottomDistance = rect.bottom - event.clientY;

      if (topDistance > 0 && topDistance < threshold) {
        const intensity = (threshold - topDistance) / threshold;
        container.scrollTop -= Math.max(4, Math.round(intensity * 18));
      } else if (bottomDistance > 0 && bottomDistance < threshold) {
        const intensity = (threshold - bottomDistance) / threshold;
        container.scrollTop += Math.max(4, Math.round(intensity * 18));
      }
    },
    [canDrag, draggedIndex],
  );

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>, index: number) => {
      event.dataTransfer.effectAllowed = "move";
      setDraggedIndex(index);
    },
    [],
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>, index: number) => {
      event.preventDefault();
      setDragOverIndex(index);
    },
    [],
  );

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>, targetIndex: number) => {
      event.preventDefault();
      if (draggedIndex !== null && draggedIndex !== targetIndex) {
        const newData = [...bodyData];
        const [movedItem] = newData.splice(draggedIndex, 1);
        newData.splice(targetIndex, 0, movedItem);
        onReorder?.(newData, movedItem, targetIndex);
      }
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [bodyData, draggedIndex, onReorder],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  const handleLinkNavigation = useCallback(
    (link: string) => {
      if (/^(https?:)?\/\//i.test(link)) {
        const resolvedLink = new URL(link, window.location.origin);

        if (resolvedLink.origin === window.location.origin) {
          navigate(
            `${resolvedLink.pathname}${resolvedLink.search}${resolvedLink.hash}`,
          );
          return;
        }

        window.open(resolvedLink.toString(), "_blank", "noopener,noreferrer");
        return;
      }

      navigate(link);
    },
    [navigate],
  );

  const handleRowClick = useCallback(
    (row: T) => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return;

      if (!detailsLink) return;

      const link =
        typeof detailsLink === "function"
          ? detailsLink(row)
          : row.id !== null && row.id !== undefined
            ? `${detailsLink}/${encodeURIComponent(String(row.id))}`
            : undefined;

      if (!link) return;
      handleLinkNavigation(link);
    },
    [detailsLink, handleLinkNavigation],
  );

  const columnOffsets = useMemo(
    () =>
      tableContents.reduce<{
        offsets: string[];
        accumulated: number;
      }>(
        (result, column) => {
          if (!column.fixed) {
            return {
              ...result,
              offsets: [...result.offsets, "0px"],
            };
          }

          const currentOffset = `${result.accumulated}px`;
          const widthValue = Number.parseInt(column.width ?? "100", 10);
          const safeWidth = Number.isNaN(widthValue) ? 100 : widthValue;

          return {
            offsets: [...result.offsets, currentOffset],
            accumulated: result.accumulated + safeWidth,
          };
        },
        { offsets: [], accumulated: 0 },
      ).offsets,
    [tableContents],
  );

  const handleContextMenu = useCallback(
    (event: MouseEvent<HTMLDivElement>, row: T) => {
      if (!getContextOptions) return;

      event.preventDefault();
      const options = getContextOptions(row);

      if (!options.length) return;

      setContextMenu({
        x: event.clientX + 12,
        y: event.clientY,
        options,
      });
    },
    [getContextOptions],
  );

  useEffect(() => {
    if (!contextMenu) return;

    const closeMenu = () => setContextMenu(null);

    window.addEventListener("click", closeMenu, true);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu, true);

    return () => {
      window.removeEventListener("click", closeMenu, true);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu, true);
    };
  }, [contextMenu]);

  if (!bodyData?.length) {
    return (
      <div className="h-full">
        <p className="rounded-3xl border border-white/10 bg-primary/40 p-8 text-center text-xs font-semibold uppercase tracking-wider text-grays-200">
          {emptyMessage || "Nenhum registro encontrado."}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-label="tabela"
      onDragOver={handleContainerDragOver}
      className={`relative h-full min-h-0 w-full overflow-x-auto rounded-3xl border border-white/10 bg-primary/40 shadow-2xl ${scrollable ? "max-w-full" : ""}`}

      style={{
        height: bodyHeight,
        maxHeight: bodyHeight,
        overflowY: bodyHeight ? "auto" : "visible",
        isolation: "isolate",
      }}
    >
      <div className="flex min-w-max w-full flex-col">
        <div
          role="rowgroup"
          className="sticky top-0 z-30 flex border-b border-white/10 bg-primary px-4 py-3.5 shadow-sm"
        >
          {canDrag ? (
            <div
              role="columnheader"
              style={{ width: "40px", flexBasis: "40px", flexShrink: 0, flexGrow: 0 }}
              className="min-w-0 items-center justify-center px-1 text-[10px] font-extrabold uppercase tracking-widest text-grays-200"
            />
          ) : null}
          {tableContents.map((column, index) => {
            const isVisible = column.show ?? true;
            const cellStyle = getFlexColumnStyle(column.width, isVisible);

            return (
              <div
                key={index}
                role="columnheader"
                style={{
                  ...cellStyle,
                  display: isVisible ? "flex" : "none",
                  position: column.fixed ? "sticky" : "static",
                  left: column.fixed ? columnOffsets[index] : undefined,
                  zIndex: column.fixed ? 35 : undefined,
                  backgroundColor: column.fixed
                    ? "var(--color-primary)"
                    : undefined,
                }}
                className={`min-w-0 items-center px-2 text-[10px] font-extrabold uppercase tracking-widest text-grays-200 ${getColumnAlignmentClasses(
                  column.align,
                )}`}
              >
                {column.title}
              </div>
            );
          })}
        </div>

        <div
          role="rowgroup"
          className="flex flex-col divide-y divide-white/5"
        >
          {bodyData.map((row, index) => (
            <TableRow
              key={`${String(row.id ?? "row")}-${index}`}
              row={row}
              index={index}
              tableContents={tableContents}
              columnOffsets={columnOffsets}
              isClickable={Boolean(detailsLink)}
              handleRowClick={handleRowClick}
              handleContextMenu={handleContextMenu}
              customRowColor={getRowColor?.(row)}
              isDraggable={canDrag}
              draggedIndex={draggedIndex}
              dragOverIndex={dragOverIndex}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </div>

      {contextMenu
        ? createPortal(
            <div
              className="fixed z-[9999] min-w-[180px] overflow-hidden rounded-2xl border border-white/15 bg-primary shadow-2xl"
              style={{ top: contextMenu.y, left: contextMenu.x }}
              onClick={(event) => event.stopPropagation()}
            >
              {contextMenu.options.map((option, index) => (
                <button
                  key={`${option.label}-${index}`}
                  type="button"
                  className="flex w-full items-center gap-2 border-b border-white/10 px-3.5 py-2.5 text-left text-xs font-semibold text-white transition last:border-b-0 hover:bg-secondary/20"
                  onClick={() => {
                    option.onClick();
                    setContextMenu(null);
                  }}
                >
                  {option.icon ? <span>{option.icon}</span> : null}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function TableRowComponent<T extends { id?: number | string }>({
  row,
  index,
  tableContents,
  columnOffsets,
  isClickable,
  handleRowClick,
  handleContextMenu,
  customRowColor,
  isDraggable,
  draggedIndex,
  dragOverIndex,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: TableRowProps<T>) {
  const isBeingDragged = draggedIndex === index;
  const isDragTarget = dragOverIndex === index;

  return (
    <div
      role="row"
      draggable={isDraggable}
      onDragStart={(event) => onDragStart?.(event, index)}
      onDragOver={(event) => onDragOver?.(event, index)}
      onDragLeave={(event) => onDragLeave?.(event)}
      onDrop={(event) => onDrop?.(event, index)}
      onDragEnd={(event) => onDragEnd?.(event)}
      onClick={() => handleRowClick(row)}
      onContextMenu={(event) => handleContextMenu(event, row)}
      className={`group flex items-center px-4 py-3.5 transition-all duration-150 ${
        isBeingDragged ? "opacity-30 bg-white/5" : ""
      } ${
        isDragTarget ? "border-t-2 border-secondary bg-secondary/10 shadow-lg" : ""
      } ${
        isClickable ? "cursor-pointer hover:bg-white/5" : "cursor-default"
      }`}
      style={{ color: customRowColor }}
    >
      {isDraggable ? (
        <div
          role="cell"
          style={{ width: "40px", flexBasis: "40px", flexShrink: 0, flexGrow: 0 }}
          className="flex min-w-0 items-center justify-center px-1 text-grays-200"
          onClick={(event) => event.stopPropagation()}
        >
          <MdDragIndicator className="h-4 w-4 cursor-grab text-grays-300 transition hover:text-white active:cursor-grabbing" />
        </div>
      ) : null}
      {tableContents.map((column, colIndex) => {
        const isVisible = column.show ?? true;
        const rawValue = row[column.key as keyof T];
        const content = column.render
          ? column.render(row)
          : ((rawValue as ReactNode) ?? "-");

        const isSimpleTextContent =
          typeof content === "string" || typeof content === "number";
        const textValue = String(content ?? "-");

        return (
          <div
            key={colIndex}
            role="cell"
            style={{
              ...getFlexColumnStyle(column.width, isVisible),
              display: isVisible ? "flex" : "none",
              position: column.fixed ? "sticky" : "static",
              left: column.fixed ? columnOffsets[colIndex] : undefined,
              zIndex: column.fixed ? 25 : undefined,
              backgroundColor: column.fixed
                ? "var(--color-primary)"
                : undefined,
            }}
            className={`min-w-0 items-center px-2 text-sm ${getColumnAlignmentClasses(
              column.align,
            )} ${column.normalCase ? "normal-case" : "uppercase"}`}
          >
            {isSimpleTextContent ? (
              <Tooltip
                text={textValue}
                overflowed
                uppercase={!column.normalCase}
                style={{ width: "100%" }}
              >
                <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {content}
                </span>
              </Tooltip>
            ) : (
              <div className="min-w-0 max-w-full">{content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getFlexColumnStyle(
  width = "10vw",
  isVisible = true,
): CSSProperties {
  if (!isVisible) return { width: "0px", flex: "0 0 0px" };

  return {
    width,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: width,
  };
}

function getColumnAlignmentClasses(align?: "left" | "center" | "right") {
  if (align === "center") return "justify-center text-center";
  if (align === "right") return "justify-end text-right";

  return "justify-start text-left";
}

export const TableRow = memo(TableRowComponent) as typeof TableRowComponent;

