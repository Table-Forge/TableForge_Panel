import { Paginate } from "@/src/components/paginate/paginate";
import { Table } from "@/src/components/table/table";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { useAllLogs } from "@/src/features/logs/hooks/use-all-logs";
import type { ILog } from "@/src/features/logs/schemas/log.schema";
import { cleanStringForKey, formatDate } from "@/src/utils/format";
import { LogsSearchFilters } from "./components/search-filters/search-filters";

export function LogsPage() {
  const { data, isLoading, isError, filters, setFilters } =
    useAllLogs();

  const tableContents: ITableColumn<ILog>[] = [
    {
      title: "ID",
      key: "id",
      width: "90px",
      align: "center",
      render: (log) => <span className="font-bold">{log.id ?? "-"}</span>,
    },
    {
      title: "Data",
      key: "dateCreated",
      width: "150px",
      align: "center",
      render: (log) => {
        const createdOn = log.dateCreated ?? log.createdAt;
        return createdOn ? formatDate(createdOn, true) : "-";
      },
    },
    {
      title: "Tipo",
      key: "type",
      width: "150px",
      normalCase: true,
      render: (log) => log.type || "-",
    },
    {
      title: "Código",
      key: "code",
      width: "220px",
      normalCase: true,
      render: (log) => log.code || "-",
    },
    {
      title: "Endpoint",
      key: "endpoint",
      width: "260px",
      normalCase: true,
      render: (log) => log.endpoint || "-",
    },
    {
      title: "Mensagem",
      key: "message",
      width: "320px",
      normalCase: true,
      render: (log) => log.message || "-",
    },
    {
      title: "Status",
      key: "statusCode",
      width: "110px",
      align: "center",
      render: (log) => (log.statusCode ?? "-") as number | string,
    },
  ];

  if (isLoading) return <SkeletonTable />;
  if (isError) return <InfoNotFound />;

  return (
    <>
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
            Logs
          </h1>
          <p className="text-sm text-grays-100">
            Histórico de logs do sistema.
          </p>
        </div>
      </header>

      <LogsSearchFilters />

      <Table
        tableContents={tableContents}
        bodyData={data?.items ?? []}
        detailsLink="/logs"
        getRowColor={(row) => {
          const normalizedType = cleanStringForKey(row.type);
          if (normalizedType === "critical") {
            return "var(--color-danger)";
          }

          return undefined;
        }}
      />

      <Paginate
        paginationData={data?.pagination}
        onPageChange={(nextPage) =>
          setFilters({
            ...filters,
            page: nextPage,
          })
        }
      />
    </>
  );
}



