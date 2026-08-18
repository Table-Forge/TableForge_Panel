import { CrmPageHeader } from "@/src/components/crm-page-header/crm-page-header";
import { ModalDelete } from "@/src/components/modals/modal-delete/modal-delete";
import { MoreInfo } from "@/src/components/more-info/more-info";
import { Paginate } from "@/src/components/paginate/paginate";
import { Table } from "@/src/components/table/table";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { Thumbnail } from "@/src/components/thumbnail/thumbnail";
import { useAllCampaigns } from "@/src/features/campaigns/hooks/use-all-campaigns";
import { useCampaignsMutation } from "@/src/features/campaigns/hooks/use-campaigns-mutations";
import type { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";
import { useBoundStore } from "@/src/store";
import { MdAdd, MdDeleteForever, MdModeEdit } from "react-icons/md";
import { ModalEdit } from "./components/modal-edit/modal-edit";
import { CampaignsSearchFilters } from "./components/search-filters/search-filters";
import { useCampaignStatusEnum } from "@/src/features/campaigns/hooks/enums/use-campaign-status-enum";
import { useCampaignDifficultyLevelEnum } from "@/src/features/campaigns/hooks/enums/use-campaign-difficulty-level-enum";

export function CampaignsPage() {
  const openModal = useBoundStore((state) => state.openModal);
  const { deleteMutation } = useCampaignsMutation();

  const { data, isLoading, isError, filters, setFilters } = useAllCampaigns();

  const { campaignStatusEnum } = useCampaignStatusEnum();
  const { difficultyLevelEnum } = useCampaignDifficultyLevelEnum();

  const getMoreInfoOptions = (item: ICampaign): IMoreOptions[] => {
    const options = [
      {
        label: "Editar",
        icon: <MdModeEdit />,
        show: true,
        onClick: () =>
          openModal("Editar Campanha", <ModalEdit data={item} />, "md"),
      },
      {
        label: "Deletar",
        icon: <MdDeleteForever />,
        show: true,
        onClick: () =>
          openModal(
            "Remover Campanha",
            <ModalDelete
              name={item.title || "Campanha"}
              id={item.id ?? 0}
              deleteMutation={deleteMutation}
            />,
            "sm",
          ),
      },
    ];

    return options.filter((opt) => opt.show);
  };

  const tableContents: ITableColumn<ICampaign>[] = [
    {
      title: "ID",
      key: "id",
      width: "90px",
      align: "center",
      render: (campaign) => (
        <span className="font-bold">{campaign.id ?? "-"}</span>
      ),
    },
    {
      title: "Banner",
      key: "bannerUrl",
      width: "100px",
      align: "center",
      normalCase: true,
      render: (campaign) => (
        <Thumbnail
          image={campaign.bannerUrl}
          width={40}
          height={40}
          alt={campaign.title || "Banner"}
        />
      ),
    },
    {
      title: "Título",
      key: "title",
      width: "220px",
      normalCase: true,
      render: (campaign) => campaign.title || "-",
    },
    {
      title: "Sistema",
      key: "gameSystemName",
      width: "180px",
      normalCase: true,
      render: (campaign) => campaign.gameSystemName || "-",
    },
    {
      title: "Status",
      key: "status",
      width: "180px",
      normalCase: true,
      render: (campaign) => campaign.status ? campaignStatusEnum.find(o => o.value === campaign.status)?.name || campaign.status : "-",
    },
    {
      title: "Dificuldade",
      key: "difficulty",
      width: "180px",
      normalCase: true,
      render: (campaign) =>
        difficultyLevelEnum.find((opt) => opt.value === campaign.difficulty)
          ?.name || "-",
    },
    {
      title: "Membros / Limite",
      key: "playersLimit",
      width: "110px",
      align: "center",
      render: (campaign) => `${campaign.membersCount ?? 0} / ${campaign.playersLimit ?? 0}`,
    },
    {
      title: "Privada",
      key: "isPrivate",
      width: "110px",
      align: "center",
      normalCase: true,
      render: (campaign) => (campaign.isPrivate ? "Sim" : "Não"),
    },
    {
      title: "Descrição",
      key: "description",
      width: "260px",
      normalCase: true,
      render: (campaign) => campaign.description || "-",
    },
    {
      title: "",
      key: "moreOptions",
      width: "50px",
      align: "center",
      render: (row) => (
        <MoreInfo
          item={row}
          options={getMoreInfoOptions(row)}
          boxSide="right"
        />
      ),
    },
  ];

  if (isLoading) return <SkeletonTable />;
  if (isError) return <InfoNotFound />;

  const totalItems = data?.pagination?.filteredItems ?? data?.items?.length ?? 0;
  const activeCount = data?.items?.filter((c) => c.status === "Active" || c.status === "Open")?.length ?? 0;

  return (
    <>
      <CrmPageHeader
        title="Campanhas"
        subtitle="Gerencie suas mesas e aventuras com estatísticas rápidas."
        count={totalItems}
        actionLabel="Criar Campanha"
        actionIcon={<MdAdd />}
        onActionClick={() => openModal("Criar Campanha", <ModalEdit />, "md")}
        stats={[
          {
            title: "Total Campanhas",
            value: totalItems,
            badge: "Geral",
            badgeType: "neutral",
          },
          {
            title: "Mesas Ativas",
            value: activeCount,
            badge: "Disponíveis",
            badgeType: "success",
          },
          {
            title: "Privadas",
            value: data?.items?.filter((c) => c.isPrivate)?.length ?? 0,
            badge: "Restrito",
            badgeType: "warning",
          },
          {
            title: "Exibindo",
            value: data?.items?.length ?? 0,
            badge: "Página Atual",
            badgeType: "neutral",
          },
        ]}
      />

      <CampaignsSearchFilters />

      <Table
        tableContents={tableContents}
        bodyData={data?.items ?? []}
        bodyHeight="100%"
        detailsLink="/campaigns"
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
