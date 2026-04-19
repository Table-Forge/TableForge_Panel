import { Button } from "@/src/components/button/button";
import { ModalDelete } from "@/src/components/modals/modal-delete/modal-delete";
import { MoreInfo } from "@/src/components/more-info/more-info";
import { Paginate } from "@/src/components/paginate/paginate";
import { Table } from "@/src/components/table/table";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { useAllCampaigns } from "@/src/features/campaigns/hooks/use-all-campaigns";
import { useCampaignsMutation } from "@/src/features/campaigns/hooks/use-campaigns-mutations";
import type { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";
import { useBoundStore } from "@/src/store";
import { MdAdd, MdDeleteForever, MdModeEdit } from "react-icons/md";
import { ModalEdit } from "./components/modal-edit/modal-edit";
import { CampaignsSearchFilters } from "./components/search-filters/search-filters";

export function CampaignsPage() {
  const openModal = useBoundStore((state) => state.openModal);
  const { deleteMutation } = useCampaignsMutation();

  const { data, isLoading, isError, filters, setFilters, resetFilters } =
    useAllCampaigns();

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
      title: "Título",
      key: "title",
      width: "220px",
      normalCase: true,
      render: (campaign) => campaign.title || "-",
    },
    {
      title: "Sistema",
      key: "system",
      width: "180px",
      normalCase: true,
      render: (campaign) => campaign.system || "-",
    },
    {
      title: "Mestre",
      key: "gameMaster",
      width: "180px",
      normalCase: true,
      render: (campaign) => campaign.gameMaster || "-",
    },
    {
      title: "Local",
      key: "location",
      width: "170px",
      normalCase: true,
      render: (campaign) => campaign.location || "-",
    },
    {
      title: "Grupo",
      key: "currentPartySize",
      width: "110px",
      align: "center",
      render: (campaign) =>
        `${campaign.currentPartySize ?? 0}/${campaign.maxPartySize ?? 0}`,
    },
    {
      title: "Resumo",
      key: "summary",
      width: "260px",
      normalCase: true,
      render: (campaign) => campaign.summary || "-",
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

  return (
    <>
      <header className="shrink-0 flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
            Campanhas
          </h1>
          <p className="text-sm text-grays-100">
            Suas campanhas disponíveis para administração.
          </p>
        </div>

        <Button
          buttonStyle="primary"
          size="sm"
          onClick={() => openModal("Criar Campanha", <ModalEdit />, "md")}
        >
          <MdAdd />
          Criar Campanha
        </Button>
      </header>

      <CampaignsSearchFilters
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
      />

      <Table
        tableContents={tableContents}
        bodyData={data?.items ?? []}
        bodyHeight="100%"
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



