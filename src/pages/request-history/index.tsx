import { FileSearch } from "lucide-react";
import { Paginate } from "@/src/components/paginate/paginate";
import { Table } from "@/src/components/table/table";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { useAllRequestHistory } from "@/src/features/request-history/hooks/use-all-request-history";
import type { IRequestHistoryItem } from "@/src/features/request-history/schemas/request-history.schema";
import { formatDate } from "@/src/utils/format";
import { RequestHistorySearchFilters } from "./components/search-filters/search-filters";
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
          <FileSearch size={16} className="mx-auto text-secondary-light" />
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
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
            Histórico de Requisições
          </h1>
          <p className="text-sm text-grays-100">
            Todas as requisições recebidas pela API, com tempos por fase.
          </p>
        </div>
      </header>

      <RequestHistorySearchFilters />

      <Table
        tableContents={tableContents}
        bodyData={data?.items ?? []}
        detailsLink="/request-history"
        emptyMessage="Nenhuma requisição encontrada no período."
        getRowColor={(row) =>
          row.statusCode && row.statusCode >= 500
            ? "var(--color-danger)"
            : undefined
        }
      />

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
