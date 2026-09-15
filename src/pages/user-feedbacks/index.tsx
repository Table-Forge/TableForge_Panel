import { CrmPageHeader } from "@/src/components/crm-page-header/crm-page-header";
import { Paginate } from "@/src/components/paginate/paginate";
import { Table } from "@/src/components/table/table";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { useAllUserFeedbacks } from "@/src/features/user-feedbacks/hooks/use-all-user-feedbacks";
import type { IUserFeedbackListDto } from "@/src/features/user-feedbacks/interfaces";
import {
  UserFeedbackCategory,
  UserFeedbackStatus,
} from "@/src/features/user-feedbacks/enums";
import dayjs from "dayjs";
import { UserFeedbacksSearchFilters } from "./components/search-filters/search-filters";
import { Tag } from "@/src/components/tag/tag";
import { Tooltip } from "@/src/components/tooltip/tooltip";
import { Clock } from "lucide-react";
import {
  useUserFeedbackCategoryEnum,
  useUserFeedbackStatusEnum,
} from "@/src/features/user-feedbacks/hooks/enums/use-user-feedback-enums";

const WAITING_FOR_TEAM_COLOR = "#f59e0b";

export function UserFeedbacksPage() {
  const { statusEnum } = useUserFeedbackStatusEnum(true, false);
  const { categoryEnum } = useUserFeedbackCategoryEnum(true, false);

  const { data, isLoading, isError, filters, setFilters } =
    useAllUserFeedbacks();

  const getStatusColor = (status: UserFeedbackStatus) => {
    switch (status) {
      case UserFeedbackStatus.New:
        return "#0ea5e9";
      case UserFeedbackStatus.InAnalysis:
        return "#f59e0b";
      case UserFeedbackStatus.Planned:
        return "#6366f1";
      case UserFeedbackStatus.Resolved:
        return "#10b981";
      case UserFeedbackStatus.Declined:
        return "#ef4444";
      case UserFeedbackStatus.Duplicated:
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case UserFeedbackCategory.Bug:
        return "#ef4444";
      case UserFeedbackCategory.Suggestion:
        return "#6366f1";
      case UserFeedbackCategory.Experience:
        return "#f59e0b";
      case UserFeedbackCategory.Compliment:
        return "#10b981";
      case UserFeedbackCategory.Complaint:
        return "#ec4899";
      case UserFeedbackCategory.Question:
        return "#06b6d4";
      case UserFeedbackCategory.Other:
      default:
        return "#8b5cf6";
    }
  };

  const tableContents: ITableColumn<IUserFeedbackListDto>[] = [
    {
      title: "Data",
      key: "createdAt",
      width: "150px",
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
      width: "320px",
      normalCase: true,
      render: (item) => (
        <div className="flex min-w-0 items-center gap-2">
          {item.waitingForTeam && (
            <Tooltip
              text="Aguardando retorno do time"
              side="right"
              style={{ flexShrink: 0 }}
            >
              <Clock size={14} color={WAITING_FOR_TEAM_COLOR} />
            </Tooltip>
          )}
          <span
            className={`min-w-0 overflow-hidden text-ellipsis whitespace-nowrap ${
              item.waitingForTeam ? "font-semibold text-white" : "text-grays-100"
            }`}
          >
            {item.title}
          </span>
        </div>
      ),
    },
    {
      title: "Assunto",
      key: "category",
      width: "220px",
      align: "center",
      render: (row) => {
        const option = categoryEnum.find((item) => item.value === row.category);
        const displayName = option?.name || row.category;
        return <Tag label={displayName} color={getCategoryColor(row.category)} />;
      },
    },
    {
      title: "Nota",
      key: "rating",
      width: "100px",
      align: "center",
      render: (item) => (item.rating ? `${item.rating} ★` : "-"),
    },
    {
      title: "Status",
      key: "status",
      width: "150px",
      align: "center",
      render: (row) => {
        const option = statusEnum.find((item) => item.value === row.status);
        const displayName = option?.name || row.status;
        return <Tag label={displayName} color={getStatusColor(row.status)} />;
      },
    },
    {
      title: "Respondido",
      key: "hasResponse",
      width: "120px",
      align: "center",
      render: (item) => (
        <Tag
          label={item.hasResponse ? "Sim" : "Não"}
          color={item.hasResponse ? "#10b981" : "#6b7280"}
        />
      ),
    },
  ];

  if (isLoading) return <SkeletonTable />;
  if (isError)
    return <InfoNotFound message="Ocorreu um erro ao carregar os feedbacks." />;

  const totalItems =
    data?.pagination?.filteredItems ?? data?.items?.length ?? 0;

  return (
    <>
      <CrmPageHeader
        title="Fila de Triagem de Feedbacks"
        subtitle="Analise bugs, sugestões e experiências dos usuários."
        count={totalItems}
      />

      <UserFeedbacksSearchFilters />

      <Table
        tableContents={tableContents}
        bodyData={data?.items ?? []}
        bodyHeight="100%"
        detailsLink="/user-feedbacks"
        emptyMessage="Nenhum feedback encontrado na fila."
        getRowAccent={(item) =>
          item.waitingForTeam ? WAITING_FOR_TEAM_COLOR : undefined
        }
      />

      {data && data.items.length > 0 && (
        <Paginate
          paginationData={data?.pagination}
          onPageChange={(nextPage) =>
            setFilters({ ...filters, page: nextPage })
          }
        />
      )}
    </>
  );
}
