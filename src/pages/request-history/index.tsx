import { ArrowUp, FileSearch, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, type UIEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/src/components/button/button";
import { Tag } from "@/src/components/tag/tag";
import { KeystoneIcon } from "@/src/components/icons/icons";
import { REQUEST_HISTORY_KEYS } from "@/src/features/request-history/hooks/query-key";
import { useRequestHistoryLiveStore } from "@/src/features/request-history/store/use-request-history-live-store";
import { Paginate } from "@/src/components/paginate/paginate";
import { Table } from "@/src/components/table/table";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { useAllRequestHistory } from "@/src/features/request-history/hooks/use-all-request-history";
import type { IRequestHistoryItem } from "@/src/features/request-history/schemas/request-history.schema";
import { formatDate } from "@/src/utils/format";
import { RequestHistorySearchFilters } from "./components/search-filters/search-filters";
import { DevicePill } from "./components/device-pill";
import { StatusPill } from "./components/status-pill";

const getTotalMsClass = (totalMs?: number) => {
  if (totalMs === undefined || totalMs === null) return "";
  if (totalMs > 3000) return "text-red-400";
  if (totalMs > 1000) return "text-amber-400";
  return "";
};

export function RequestHistoryPage() {
  const { data, isLoading, isError, filters, setFilters } =
    useAllRequestHistory();

  const isPaused = useRequestHistoryLiveStore((state) => state.isPaused);
  const pauseReason = useRequestHistoryLiveStore((state) => state.pauseReason);
  const pendingCount = useRequestHistoryLiveStore((state) => state.pendingCount);
  const pause = useRequestHistoryLiveStore((state) => state.pause);
  const resume = useRequestHistoryLiveStore((state) => state.resume);
  const resetLiveStore = useRequestHistoryLiveStore((state) => state.reset);
  const queryClient = useQueryClient();

  const tableRef = useRef<HTMLDivElement>(null);

  const currentPage = filters.page ?? 1;

  const handleResume = useCallback(() => {
    resume();
    queryClient.invalidateQueries({ queryKey: REQUEST_HISTORY_KEYS.lists() });
  }, [queryClient, resume]);

  const handleTogglePause = useCallback(() => {
    if (isPaused) {
      if ((filters.page ?? 1) > 1) {
        setFilters({ ...filters, page: 1 });
      }
      handleResume();
    } else {
      pause("manual");
    }
  }, [filters, handleResume, isPaused, pause, setFilters]);

  const handleScrollToTopAndResume = useCallback(() => {
    tableRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    if ((filters.page ?? 1) > 1) {
      setFilters({ ...filters, page: 1 });
    }
    handleResume();
  }, [filters, handleResume, setFilters]);

  const handleTableScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const isScrolledDown = event.currentTarget.scrollTop > 60;
      const { isPaused: currentPaused, pauseReason: currentReason } =
        useRequestHistoryLiveStore.getState();

      if (isScrolledDown) {
        if (!currentPaused) {
          pause("scroll");
        }
      } else {
        if (currentPaused && currentReason === "scroll") {
          handleResume();
        }
      }
    },
    [handleResume, pause],
  );

  useEffect(() => {
    const { isPaused: currentPaused, pauseReason: currentReason } =
      useRequestHistoryLiveStore.getState();

    if (currentPage > 1) {
      if (!currentPaused) {
        pause("page");
      }
    } else {
      if (currentPaused && currentReason === "page") {
        handleResume();
      }
    }
  }, [currentPage, handleResume, pause]);

  useEffect(() => {
    return () => {
      resetLiveStore();
    };
  }, [resetLiveStore]);

  const tableContents: ITableColumn<IRequestHistoryItem>[] = [
    {
      title: "Status",
      key: "statusCode",
      width: "90px",
      align: "center",
      render: (request) => <StatusPill statusCode={request.statusCode} />,
    },
    {
      title: "Método",
      key: "method",
      width: "80px",
      align: "center",
      render: (request) => request.method || "-",
    },
    {
      title: "Rota",
      key: "route",
      normalCase: true,
      render: (request) => request.route || request.path || "-",
    },
    {
      title: "Usuário",
      key: "userLogin",
      width: "140px",
      normalCase: true,
      render: (request) => request.userLogin || "-",
    },
    {
      title: "Origem",
      key: "userAgent",
      width: "140px",
      align: "center",
      normalCase: true,
      render: (request) => <DevicePill userAgent={request.userAgent} />,
    },
    {
      title: "Total",
      key: "totalMs",
      width: "90px",
      align: "right",
      render: (request) => (
        <span className={`font-bold ${getTotalMsClass(request.totalMs)}`}>
          {request.totalMs !== undefined && request.totalMs !== null
            ? `${request.totalMs} ms`
            : "-"}
        </span>
      ),
    },
    {
      title: "Banco",
      key: "dbMs",
      width: "120px",
      align: "center",
      render: (request) => {
        if (request.dbMs === undefined || request.dbMs === null) return "-";
        const hasFailures = Boolean(request.dbFailedCommands);
        return (
          <span className={hasFailures ? "font-bold text-red-400" : ""}>
            {`${Math.round(request.dbMs)} ms · ${request.dbCommands ?? 0} cmd`}
          </span>
        );
      },
    },
    {
      title: "Data",
      key: "createdAt",
      width: "150px",
      align: "center",
      render: (request) =>
        request.createdAt ? formatDate(request.createdAt, true) : "-",
    },
    {
      title: "Diagnóstico",
      key: "hasDetails",
      width: "60px",
      align: "center",
      render: (request) =>
        request.hasDetails ? (
          <FileSearch size={16} className="mx-auto text-ember" />
        ) : (
          "-"
        ),
    },
  ];

  if (isLoading) return <SkeletonTable />;
  if (isError)
    return (
      <InfoNotFound message="Ocorreu um erro ao carregar o histórico de requisições." />
    );

  return (
    <>
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <KeystoneIcon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <h1 className="font-display text-2xl font-bold uppercase tracking-[0.04em] text-white">
              Histórico de Requisições
            </h1>
            {isPaused ? (
              <Tag
                label={
                  pauseReason === "scroll"
                    ? "Pausado por rolagem"
                    : pauseReason === "filter"
                      ? "Pausado (Filtrando)"
                      : pauseReason === "page"
                        ? `Pausado (Página ${currentPage})`
                        : "Pausado"
                }
                color="#f59e0b"
              />
            ) : (
              <Tag label="Tempo Real" color="#10b981" />
            )}
          </div>
          <p className="text-sm text-grays-100">
            {isPaused
              ? pauseReason === "filter"
                ? "Atualizações pausadas enquanto você ajusta os filtros."
                : pauseReason === "page"
                  ? `Atualizações pausadas na página ${currentPage}. Volte para a primeira página ou clique em retomar.`
                  : "Atualizações em tempo real suspensas. Clique em retomar ou volte ao topo para reativar."
              : "Todas as requisições recebidas pela API, atualizadas automaticamente via SignalR."}
          </p>
        </div>

        <Button
          type="button"
          buttonStyle="soft"
          size="sm"
          onClick={handleTogglePause}
          className="shrink-0"
        >
          {isPaused ? (
            <>
              <Play size={16} />
              {pendingCount > 0 ? `Retomar (+${pendingCount})` : "Retomar"}
            </>
          ) : (
            <>
              <Pause size={16} />
              Pausar
            </>
          )}
        </Button>
      </header>

      <RequestHistorySearchFilters />

      <div className="relative flex-1 min-h-0 flex flex-col">
        <Table
          tableContents={tableContents}
          bodyData={data?.items ?? []}
          bodyHeight="100%"
          containerRef={tableRef}
          onScroll={handleTableScroll}
          detailsLink="/request-history"
          emptyMessage="Nenhuma requisição encontrada no período."
          getRowColor={(row) =>
            row.statusCode && row.statusCode >= 500
              ? "var(--color-danger)"
              : undefined
          }
        />

        {pendingCount > 0 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center">
            <button
              type="button"
              onClick={handleScrollToTopAndResume}
              className="pointer-events-auto flex cursor-pointer items-center gap-2 chamfer-sm border border-accent/40 bg-surface px-4 py-2 text-xs font-bold text-accent transition hover:bg-accent/10"
            >
              <ArrowUp size={14} />
              {pendingCount === 1
                ? "1 nova requisição • Voltar ao topo"
                : `${pendingCount} novas requisições • Voltar ao topo`}
            </button>
          </div>
        )}
      </div>

      {data && data.items.length > 0 && (
        <Paginate
          paginationData={data?.pagination}
          onPageChange={(nextPage) =>
            setFilters({
              ...filters,
              page: nextPage,
            })
          }
        />
      )}
    </>
  );
}
