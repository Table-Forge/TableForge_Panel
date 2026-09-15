import { Plus } from "lucide-react";
import { useBoundStore } from "@/src/store";
import { CrmPageHeader } from "@/src/components/crm-page-header/crm-page-header";
import { Table } from "@/src/components/table/table";
import { Paginate } from "@/src/components/paginate/paginate";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { type ITableColumn } from "@/src/components/table/table.interfaces";
import { formatDate } from "@/src/utils/format";
import { useAllTerms } from "@/src/features/terms/hooks/use-all-terms";
import {
  useTermsAudienceEnum,
  useTermsStatusEnum,
} from "@/src/features/terms/hooks/enums/use-terms-enums";
import { type ITermsDocumentList } from "@/src/features/terms/schemas/terms.schema";
import { TermsSearchFilters } from "./components/search-filters/search-filters";
import { TermsStatusBadge } from "./components/terms-status-badge/terms-status-badge";
import { ModalEdit } from "./components/modal-edit/modal-edit";

export function TermsPage() {
  const openModal = useBoundStore((state) => state.openModal);

  const { data, isLoading, isError, filters, setFilters } = useAllTerms();
  const { data: statusEnum } = useTermsStatusEnum(false);
  const { data: audienceEnum } = useTermsAudienceEnum(false);

  const tableContents: ITableColumn<ITermsDocumentList>[] = [
    {
      title: "Público",
      key: "audience",
      width: "140px",
      render: (item) => {
        const match = audienceEnum?.find((a) => a.value === item.audience);
        return match?.name ?? item.audience;
      },
    },
    {
      title: "Versão",
      key: "version",
      width: "90px",
      align: "center",
      render: (item) => (
        <span className="shrink-0 whitespace-nowrap rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-black text-secondary">
          v{item.version}
        </span>
      ),
    },
    {
      title: "Título",
      key: "title",
      width: "340px",
      normalCase: true,
      render: (item) => (
        <span className="font-bold text-white hover:text-secondary transition-colors break-words">
          {item.title}
        </span>
      ),
    },
    {
      title: "Situação",
      key: "status",
      width: "160px",
      align: "center",
      render: (item) => (
        <TermsStatusBadge value={item.status} options={statusEnum} />
      ),
    },
    {
      title: "Formato",
      key: "hasFile",
      width: "100px",
      align: "center",
      render: (item) => (
        <span className="text-xs font-bold text-grays-200">
          {item.hasFile ? "PDF" : "HTML"}
        </span>
      ),
    },
    {
      title: "Aceites",
      key: "acceptanceCount",
      width: "100px",
      align: "center",
      render: (item) => (
        <span className="font-extrabold text-white">
          {item.acceptanceCount ?? 0}
        </span>
      ),
    },
    {
      title: "Cadastrado em",
      key: "createdAt",
      width: "180px",
      align: "center",
      render: (item) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-white">
            {formatDate(item.createdAt)}
          </span>
          {item.createdByName && (
            <span className="text-grays-200 text-[11px]">
              por {item.createdByName}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Aprovado em",
      key: "approvedAt",
      width: "180px",
      align: "center",
      render: (item) =>
        item.approvedAt ? (
          <div className="flex flex-col text-xs">
            <span className="font-semibold text-white">
              {formatDate(item.approvedAt)}
            </span>
            {item.approvedByName && (
              <span className="text-grays-200 text-[11px]">
                por {item.approvedByName}
              </span>
            )}
          </div>
        ) : (
          <span className="text-grays-300 text-xs">-</span>
        ),
    },
  ];

  if (isLoading) return <SkeletonTable />;
  if (isError) {
    return (
      <InfoNotFound message="Ocorreu um erro ao carregar os termos e condições." />
    );
  }

  const totalItems = data?.pagination?.filteredItems ?? data?.items?.length ?? 0;
  const activeCount =
    data?.items?.filter((t) => t.status === "Active")?.length ?? 0;

  return (
    <>
      <CrmPageHeader
        title="Termos e Condições"
        subtitle="Cadastre, aprove e versione os contratos de termos de uso da plataforma."
        count={totalItems}
        actionLabel="Novo Contrato"
        actionIcon={<Plus size={18} />}
        onActionClick={() =>
          openModal("Cadastrar Contrato", <ModalEdit />, "lg")
        }
        stats={[
          {
            title: "Total Versões",
            value: totalItems,
            badge: "Geral",
            badgeType: "neutral",
          },
          {
            title: "Ativos",
            value: activeCount,
            badge: "Em Vigor",
            badgeType: "success",
          },
          {
            title: "Exibindo",
            value: data?.items?.length ?? 0,
            badge: "Página Atual",
            badgeType: "neutral",
          },
        ]}
      />

      <div className="flex flex-col gap-3">
        <TermsSearchFilters />

        <Table
          tableContents={tableContents}
          bodyData={data?.items ?? []}
          detailsLink="/settings/terms"
          emptyMessage="Nenhum contrato de termos encontrado."
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
      </div>
    </>
  );
}
