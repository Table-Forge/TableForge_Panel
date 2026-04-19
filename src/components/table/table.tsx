import { createPortal } from "react-dom";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@/src/components/tooltip/tooltip";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";
import type { ITable, TableRowProps } from "./table.interfaces";

export function Table<T extends { id?: number | string }>({
  tableContents,
  bodyData,
  detailsLink,
  bodyHeight,
  scrollable = true,
  getRowColor,
  getContextOptions,
}: ITable<T>) {
  const navigate = useNavigate();
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    options: IMoreOptions[];
  } | null>(null);

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
        <p className="rounded-2xl border border-white/10 bg-primary/40 px-3 py-6 text-center text-xs font-semibold uppercase tracking-wider text-grays-100">
          Nenhum dado listado.
        </p>
      </div>
    );
  }

  return (
    <div
      aria-label="tabela"
      className={`relative h-full min-h-0 w-full overflow-x-auto ${scrollable ? "max-w-full" : ""}`}
      style={{
        height: bodyHeight,
        maxHeight: bodyHeight,
        overflowY: bodyHeight ? "auto" : "visible",
        isolation: "isolate",
      }}
    >
      <div className="flex min-w-max flex-col">
        <div
          role="rowgroup"
          className="sticky top-0 z-30 flex gap-4 rounded-t-2xl border border-white/10 bg-primary px-4 py-3"
        >
          {tableContents.map((column, index) => {
            const isVisible = column.show ?? true;

            return (
              <div
                key={index}
                role="columnheader"
                style={{
                  display: isVisible ? "flex" : "none",
                  width: column.width || "10vw",
                  flexGrow: 1,
                  position: column.fixed ? "sticky" : "static",
                  left: column.fixed ? columnOffsets[index] : undefined,
                  zIndex: column.fixed ? 35 : undefined,
                  backgroundColor: column.fixed
                    ? "var(--color-primary)"
                    : undefined,
                }}
                className={`items-center text-[11px] font-bold uppercase tracking-widest text-grays-100 ${
                  column.align === "center"
                    ? "justify-center text-center"
                    : column.align === "right"
                      ? "justify-end text-right"
                      : "justify-start text-left"
                }`}
              >
                {column.title}
              </div>
            );
          })}
        </div>

        <div
          role="rowgroup"
          className="flex flex-col gap-2 rounded-b-2xl border border-white/10 bg-primary/15 p-2"
        >
          {bodyData.map((row, index) => (
            <TableRow
              key={`${String(row.id ?? "row")}-${index}`}
              row={row}
              tableContents={tableContents}
              columnOffsets={columnOffsets}
              isClickable={Boolean(detailsLink)}
              handleRowClick={handleRowClick}
              handleContextMenu={handleContextMenu}
              customRowColor={getRowColor?.(row)}
            />
          ))}
        </div>
      </div>

      {contextMenu
        ? createPortal(
            <div
              className="fixed z-[9999] min-w-[180px] overflow-hidden rounded-xl border border-white/15 bg-primary shadow-2xl"
              style={{ top: contextMenu.y, left: contextMenu.x }}
              onClick={(event) => event.stopPropagation()}
            >
              {contextMenu.options.map((option, index) => (
                <button
                  key={`${option.label}-${index}`}
                  type="button"
                  className="flex w-full items-center gap-2 border-b border-white/10 px-3 py-2 text-left text-xs font-semibold text-white transition last:border-b-0 hover:bg-secondary/15"
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
  tableContents,
  columnOffsets,
  isClickable,
  handleRowClick,
  handleContextMenu,
  customRowColor,
}: TableRowProps<T>) {
  return (
    <div
      role="row"
      onClick={() => handleRowClick(row)}
      onContextMenu={(event) => handleContextMenu(event, row)}
      className={`group flex items-center gap-4 rounded-xl border border-white/10 bg-primary/80 px-4 py-3 transition ${
        isClickable
          ? "cursor-pointer hover:border-secondary/40 hover:shadow-md"
          : "cursor-default"
      }`}
      style={{ color: customRowColor }}
    >
      {tableContents.map((column, index) => {
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
            key={index}
            role="cell"
            style={{
              display: isVisible ? "flex" : "none",
              width: column.width || "10vw",
              flexGrow: 1,
              position: column.fixed ? "sticky" : "static",
              left: column.fixed ? columnOffsets[index] : undefined,
              zIndex: column.fixed ? 25 : undefined,
              backgroundColor: column.fixed
                ? "var(--color-primary)"
                : undefined,
            }}
            className={`items-center px-0 text-sm ${
              column.align === "center"
                ? "justify-center text-center"
                : column.align === "right"
                  ? "justify-end text-right"
                  : "justify-start text-left"
            } ${column.normalCase ? "normal-case" : "uppercase"} min-w-0`}
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
              <div className="w-full min-w-0">
                {content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export const TableRow = memo(TableRowComponent) as typeof TableRowComponent;
