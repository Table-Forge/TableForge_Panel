import {
  Button,
  Input,
  ModalDelete,
  MoreInfo,
  Paginate,
  Table,
} from "@/src/components";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { useCampaignsMutation } from "@/src/features/campaigns/hooks/use-campaigns-mutations";
import {
  CAMPAIGNS_PAGE_SIZE,
  useCampaigns,
} from "@/src/features/campaigns/hooks/use-campaigns";
import type { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import type { IMoreOptions } from "@/src/interfaces";
import { useBoundStore } from "@/src/store";
import { useMemo, useState } from "react";
import { MdAdd, MdDeleteForever, MdModeEdit } from "react-icons/md";
import { ModalEdit } from "./components/modal-edit/modal-edit";

export function CampaignsPage() {
  const openModal = useBoundStore((state) => state.openModal);
  const { deleteMutation } = useCampaignsMutation();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useCampaigns({
    page,
    size: CAMPAIGNS_PAGE_SIZE,
    search,
  });

  const campaigns = data?.items ?? [];

  const paginationData = useMemo(
    () => ({
      page: data?.page ?? page,
      itemsPerPage: data?.size ?? CAMPAIGNS_PAGE_SIZE,
      filteredItems: data?.totalItems ?? campaigns.length,
    }),
    [campaigns.length, data?.page, data?.size, data?.totalItems, page],
  );

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
      title: "Titulo",
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

  if (isLoading && campaigns.length === 0) return <SkeletonTable />;
  if (isError) return <InfoNotFound />;

  return (
    <>
      <header className="shrink-0 flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
            Campanhas
          </h1>
          <p className="text-sm text-grays-100">
            Suas campanhas disponiveis para administracao.
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

      <div className="shrink-0 rounded-2xl border border-white/10 bg-primary/55 p-3">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Buscar campanha por titulo, sistema, mestre ou local"
          wrapperClassName="w-full"
        />
      </div>

      <Table
        tableContents={tableContents}
        bodyData={campaigns}
        bodyHeight="100%"
      />

      <Paginate paginationData={paginationData} onPageChange={setPage} />
    </>
  );
}
