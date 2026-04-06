import { Tooltip } from "@/src/components/tooltip/tooltip";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { ITable } from "./table.interfaces";

export function Table<T extends { id: string | number }>({
  headerData,
  bodyData,
  detailsLink,
  bodyHeight,
  scrollable = true,
}: ITable<T>) {
  const navigate = useNavigate();

  const handleLinkNavigation = (link: string) => {
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
  };

  return (
    <div
      aria-label="table"
      className={`relative h-full min-h-full w-full overflow-x-auto ${scrollable ? "max-w-full" : ""}`}
      style={{ maxHeight: bodyHeight, overflowY: "auto" }}
    >
      <div className="flex min-w-max flex-col">
        <div
          role="rowgroup"
          className="sticky top-0 z-20 flex gap-4 rounded-t-2xl border border-white/10 bg-primary px-4 py-3"
        >
          {headerData.map((column, index) => (
            <div
              key={index}
              role="columnheader"
              style={{ width: column.width || "10vw", flexGrow: 1 }}
              className={`flex items-center text-[11px] font-bold uppercase tracking-widest text-grays-100 ${
                column.align === "center"
                  ? "justify-center text-center"
                  : column.align === "right"
                    ? "justify-end text-right"
                    : "justify-start text-left"
              }`}
            >
              {column.title}
            </div>
          ))}
        </div>

        <div
          role="rowgroup"
          className="flex flex-col gap-2 rounded-b-2xl bg-primary/15 p-2 border border-white/10"
        >
          {bodyData.map((row) => {
            const link =
              typeof detailsLink === "function"
                ? detailsLink(row)
                : detailsLink
                  ? `${detailsLink}/${row.id}`
                  : undefined;

            return (
              <div
                key={row.id}
                role="row"
                data-testid={`row-${row.id}`}
                onClick={() => link && handleLinkNavigation(link)}
                className={`group flex items-center gap-4 rounded-xl border border-white/10 bg-primary/80 px-4 py-3 transition ${
                  link
                    ? "cursor-pointer hover:border-secondary/40 hover:shadow-md"
                    : "cursor-default"
                }`}
              >
                {headerData.map((column, index) => {
                  const rawValue = row[column.key as keyof T];
                  const isStringOrNumber =
                    typeof rawValue === "string" ||
                    typeof rawValue === "number";

                  const hasTooltip =
                    !column.render &&
                    isStringOrNumber &&
                    String(rawValue).trim() !== "" &&
                    String(rawValue).trim() !== "-";

                  const content = column.render
                    ? column.render(row)
                    : ((rawValue as ReactNode) ?? "-");

                  return (
                    <div
                      key={index}
                      role="cell"
                      style={{ width: column.width || "10vw", flexGrow: 1 }}
                      className={`flex items-center text-sm text-white/90 ${
                        column.align === "center"
                          ? "justify-center text-center"
                          : column.align === "right"
                            ? "justify-end text-right"
                            : "justify-start text-left"
                      } ${column.normalCase ? "normal-case" : "uppercase"}`}
                    >
                      {hasTooltip ? (
                        <Tooltip
                          text={String(rawValue)}
                          overflowed
                          uppercase={!column.normalCase}
                        >
                          {content}
                        </Tooltip>
                      ) : (
                        <>{content}</>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
