import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import type { IPaginateProps, IPages } from "./paginate.interface";

export const Paginate: React.FC<IPaginateProps> = ({
  paginationData,
  onPageChange,
  className = "",
}) => {
  const { page, itemsPerPage, filteredItems } = paginationData;

  const totalPages = useMemo(() => {
    if (filteredItems <= 0 || itemsPerPage <= 0) return 0;

    return Math.ceil(filteredItems / itemsPerPage);
  }, [filteredItems, itemsPerPage]);

  const safePage =
    totalPages <= 0 ? 1 : Math.min(Math.max(page, 1), totalPages);

  const itemStart =
    filteredItems === 0 || itemsPerPage <= 0
      ? 0
      : (safePage - 1) * itemsPerPage + 1;

  const itemEnd =
    itemsPerPage <= 0 ? 0 : Math.min(safePage * itemsPerPage, filteredItems);

  const pages = useMemo(() => {
    const arrPages: IPages[] = [];

    if (totalPages <= 0) return arrPages;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) {
        arrPages.push({ id: i, value: i, disabled: false });
      }
    } else {
      arrPages.push({ id: 1, value: 1, disabled: false });

      if (safePage <= 3) {
        for (let i = 2; i <= 5; i += 1) {
          arrPages.push({ id: i, value: i, disabled: false });
        }
        arrPages.push({ id: "ellipsis-end", value: "...", disabled: true });
        arrPages.push({ id: totalPages, value: totalPages, disabled: false });
      } else if (safePage >= totalPages - 3) {
        arrPages.push({ id: "ellipsis-start", value: "...", disabled: true });

        for (let i = totalPages - 4; i <= totalPages; i += 1) {
          arrPages.push({ id: i, value: i, disabled: false });
        }
      } else {
        arrPages.push({ id: "ellipsis-start", value: "...", disabled: true });

        for (let i = safePage - 1; i <= safePage + 1; i += 1) {
          arrPages.push({ id: i, value: i, disabled: false });
        }

        arrPages.push({ id: "ellipsis-end", value: "...", disabled: true });
        arrPages.push({ id: totalPages, value: totalPages, disabled: false });
      }
    }

    return arrPages;
  }, [safePage, totalPages]);

  const handleChangePage = (nextPage: number) => {
    if (totalPages <= 0) return;

    const clampedPage = Math.min(Math.max(nextPage, 1), totalPages);
    if (clampedPage === safePage) return;

    onPageChange(clampedPage);
  };

  return (
    <footer
      className={`flex flex-col gap-4 border-t border-white/10 pt-4 md:flex-row md:items-center md:justify-between ${className}`}
    >
      <p className="text-sm text-grays-100">
        Mostrando <span className="font-bold text-secondary">{itemStart}</span>{" "}
        a <span className="font-bold text-secondary">{itemEnd}</span> de{" "}
        <span className="font-bold text-secondary">{filteredItems}</span>{" "}
        registros
      </p>

      {pages.length > 0 ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleChangePage(safePage - 1)}
            disabled={safePage <= 1}
            title="Anterior"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-primary text-tertiary transition hover:border-tertiary/50 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={14} />
          </button>

          <div className="flex items-center gap-1">
            {pages.map((item) => {
              const isSelected = item.value === safePage;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.disabled}
                  onClick={() =>
                    !item.disabled ? handleChangePage(Number(item.value)) : null
                  }
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold transition ${isSelected ? "bg-tertiary text-white" : "bg-transparent text-white/90 hover:bg-white/10"} disabled:cursor-default disabled:text-grays-200 disabled:hover:bg-transparent`}
                >
                  {item.value}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleChangePage(safePage + 1)}
            disabled={safePage >= totalPages || totalPages === 0}
            title="Próximo"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-primary text-tertiary transition hover:border-tertiary/50 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      ) : null}
    </footer>
  );
};
