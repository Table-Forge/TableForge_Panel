import { useState } from "react";
import { CrmPageHeader } from "@/src/components/crm-page-header/crm-page-header";
import { Paginate } from "@/src/components/paginate/paginate";
import { Table } from "@/src/components/table/table";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { useBoundStore } from "@/src/store";
import { MdImage, MdModeEdit } from "react-icons/md";
import { useUserFeedbacksQuery } from "@/src/features/user-feedbacks/hooks/use-user-feedbacks-queries";
import type { IUserFeedbackListDto } from "@/src/features/user-feedbacks/interfaces";
import { UserFeedbackStatus } from "@/src/features/user-feedbacks/enums";
import { ModalFeedbackDetails } from "./components/modal-feedback-details/modal-feedback-details";
import { MoreInfo } from "@/src/components/more-info/more-info";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";
import dayjs from "dayjs";
import { UserFeedbacksFilters, type IUserFeedbackFilterState } from "./components/filters/user-feedbacks-filters";
import { MatrixTag } from "@/src/components/matrix-tag/matrix-tag";

export function UserFeedbacksPage() {
  const openModal = useBoundStore((state) => state.openModal);

  const [filters, setFilters] = useState<IUserFeedbackFilterState>({
    status: UserFeedbackStatus.New,
    page: 1,
    size: 20,
  });

  const { data, isLoading, isError } = useUserFeedbacksQuery(filters);

  const getStatusColor = (status: UserFeedbackStatus) => {
    switch (status) {
      case UserFeedbackStatus.New: return "#0ea5e9";
      case UserFeedbackStatus.InAnalysis: return "#f59e0b";
      case UserFeedbackStatus.Planned: return "#6366f1";
      case UserFeedbackStatus.Resolved: return "#10b981";
      case UserFeedbackStatus.Declined: return "#ef4444";
      case UserFeedbackStatus.Duplicated: return "#6b7280";
      default: return "#6b7280";
    }
  };

  const getMoreInfoOptions = (item: IUserFeedbackListDto): IMoreOptions[] => {
    return [
      {
        label: "Triagem / Detalhes",
        icon: <MdModeEdit />,
        show: true,
        onClick: () =>
          openModal("Detalhes do Feedback", <ModalFeedbackDetails feedbackId={item.id} />, "lg"),
      },
    ];
  };

  const tableContents: ITableColumn<IUserFeedbackListDto>[] = [
    {
      title: "ID",
      key: "id",
      width: "80px",
      align: "center",
      render: (item) => <span className="font-bold">{item.id}</span>,
    },
    {
      title: "Data",
      key: "createdAt",
      width: "140px",
      render: (item) => dayjs(item.createdAt).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Usuário",
      key: "userName",
      width: "180px",
      render: (item) => item.userName,
    },
    {
      title: "Título",
      key: "title",
      width: "250px",
      render: (item) => item.title,
    },
    {
      title: "Assunto",
      key: "category",
      width: "120px",
      align: "center",
      render: (row) => (
        <MatrixTag matrixName={row.category} />
      ),
    },
    {
      title: "Nota",
      key: "rating",
      width: "90px",
      align: "center",
      render: (item) => (item.rating ? `${item.rating} ★` : "-"),
    },
    {
      title: "Status",
      key: "status",
      width: "140px",
      align: "center",
      render: (row) => (
        <MatrixTag matrixName={row.status} lineColor={getStatusColor(row.status)} />
      ),
    },
    {
      title: "Anexos",
      key: "imageCount",
      width: "100px",
      align: "center",
      render: (item) => (
        <div className="flex items-center justify-center gap-1 text-grays-200">
          <MdImage /> <span>{item.imageCount}</span>
        </div>
      ),
    },
    {
      title: "Respondido",
      key: "hasResponse",
      width: "120px",
      align: "center",
      render: (item) => (
        <MatrixTag
          matrixName={item.hasResponse ? "Sim" : "Não"}
          lineColor={item.hasResponse ? "#10b981" : "#6b7280"}
        />
      ),
    },
    {
      title: "",
      key: "moreOptions",
      width: "60px",
      align: "center",
      render: (row) => (
        <MoreInfo item={row as unknown as Record<string, unknown>} options={getMoreInfoOptions(row)} boxSide="right" />
      ),
    },
  ];

  if (isLoading) return <SkeletonTable />;
  if (isError) return <InfoNotFound message="Ocorreu um erro ao carregar os feedbacks." />;

  const totalItems = data?.pagination?.filteredItems ?? data?.items?.length ?? 0;

  return (
    <>
      <CrmPageHeader
        title="Fila de Triagem de Feedbacks"
        subtitle="Analise bugs, sugestões e experiências dos usuários."
        count={totalItems}
      />

      <UserFeedbacksFilters filters={filters} setFilters={setFilters} />

      <Table
        tableContents={tableContents}
        bodyData={data?.items ?? []}
        bodyHeight="100%"
        emptyMessage="Nenhum feedback encontrado na fila."
      />

      {data && data.items.length > 0 && (
        <Paginate
          paginationData={data?.pagination}
          onPageChange={(nextPage) => setFilters({ ...filters, page: nextPage })}
        />
      )}
    </>
  );
}
