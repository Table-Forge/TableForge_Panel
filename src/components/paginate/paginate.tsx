import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { ButtonIcon } from "@/src/components/button-icon/button-icon";
import type { IPaginateProps, IPages } from "./paginate.interface";

export const Paginate: React.FC<IPaginateProps> = ({
  paginationData,
  onPageChange,
  className = "",
}) => {
  const page = paginationData?.page ?? 1;
  const size = paginationData?.size ?? 0;
  const filteredItems = paginationData?.filteredItems ?? 0;

  const totalPages = useMemo(() => {
    if (filteredItems <= 0 || size <= 0) return 0;

    return Math.ceil(filteredItems / size);
  }, [filteredItems, size]);

  const safePage =
    totalPages <= 0 ? 1 : Math.min(Math.max(page, 1), totalPages);

  const itemStart =
    filteredItems === 0 || size <= 0 ? 0 : (safePage - 1) * size + 1;

  const itemEnd = size <= 0 ? 0 : Math.min(safePage * size, filteredItems);

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
      className={`flex flex-col gap-4 rounded-3xl border border-white/10 bg-primary/40 p-4 backdrop-blur-md shadow-lg md:flex-row md:items-center md:justify-between ${className}`}
    >
      <p className="text-sm font-medium text-grays-100">
        Mostrando <span className="font-bold text-white">{itemStart}</span> a{" "}
        <span className="font-bold text-white">{itemEnd}</span> de{" "}
        <span className="font-bold text-secondary">{filteredItems}</span> registros
      </p>

      {pages.length > 0 ? (
        <div className="flex items-center gap-2">
          <ButtonIcon
            onClick={() => handleChangePage(safePage - 1)}
            disabled={safePage <= 1}
            title="Anterior"
            aria-label="Página anterior"
            color="var(--color-secondary)"
            hasHoverEffect
            size="34px"
            className="rounded-xl border border-white/15 bg-white/5 hover:border-secondary/50"
          >
            <ChevronLeft size={16} />
          </ButtonIcon>

          <div className="flex items-center gap-1.5">
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
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-xl px-2.5 text-xs font-bold transition-all duration-150 ${
                    isSelected
                      ? "bg-secondary text-white shadow-md shadow-secondary/20"
                      : "bg-white/5 text-white/90 hover:bg-white/15"
                  } disabled:cursor-default disabled:opacity-40 disabled:hover:bg-white/5`}
                >
                  {item.value}
                </button>
              );
            })}
          </div>

          <ButtonIcon
            onClick={() => handleChangePage(safePage + 1)}
            disabled={safePage >= totalPages || totalPages === 0}
            title="Próximo"
            aria-label="Próxima página"
            color="var(--color-secondary)"
            hasHoverEffect
            size="34px"
            className="rounded-xl border border-white/15 bg-white/5 hover:border-secondary/50"
          >
            <ChevronRight size={16} />
          </ButtonIcon>
        </div>
      ) : null}
    </footer>
  );
};
