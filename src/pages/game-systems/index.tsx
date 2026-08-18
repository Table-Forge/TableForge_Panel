import { CrmPageHeader } from "@/src/components/crm-page-header/crm-page-header";
import { ModalDelete } from "@/src/components/modals/modal-delete/modal-delete";
import { MoreInfo } from "@/src/components/more-info/more-info";
import { Paginate } from "@/src/components/paginate/paginate";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import { Table } from "@/src/components/table/table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { Thumbnail } from "@/src/components/thumbnail/thumbnail";
import { useAllGameSystems } from "@/src/features/game-systems/hooks/use-all-game-systems";
import { useGameSystemsMutation } from "@/src/features/game-systems/hooks/use-game-systems-mutations";
import type { IGameSystem } from "@/src/features/game-systems/schemas/game-system.schema";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";
import { useBoundStore } from "@/src/store";
import { MdAdd, MdDeleteForever, MdModeEdit } from "react-icons/md";
import { ModalEdit } from "./components/modal-edit/modal-edit";
import { GameSystemsSearchFilters } from "./components/search-filters/search-filters";

export function GameSystemsPage() {
  const openModal = useBoundStore((state) => state.openModal);
  const { deleteMutation } = useGameSystemsMutation();

  const { data, isLoading, isError, filters, setFilters } = useAllGameSystems();

  const getMoreInfoOptions = (item: IGameSystem): IMoreOptions[] => {
    const options = [
      {
        label: "Editar",
        icon: <MdModeEdit />,
        show: true,
        onClick: () =>
          openModal("Editar Sistema de Jogo", <ModalEdit data={item} />, "md"),
      },
      {
        label: "Deletar",
        icon: <MdDeleteForever />,
        show: true,
        onClick: () =>
          openModal(
            "Remover Sistema de Jogo",
            <ModalDelete
              name={item.name || "Sistema de jogo"}
              id={item.id ?? 0}
              deleteMutation={deleteMutation}
            />,
            "sm",
          ),
      },
    ];

    return options.filter((opt) => opt.show);
  };

  const tableContents: ITableColumn<IGameSystem>[] = [
    {
      title: "ID",
      key: "id",
      width: "100px",
      align: "center",
      render: (gameSystem) => (
        <span className="font-bold">{gameSystem.id ?? "-"}</span>
      ),
    },
    {
      title: "Imagem",
      key: "imageUrl",
      width: "110px",
      align: "center",
      normalCase: true,
      render: (row) => {
        return (
          <Thumbnail
            image={row.imageUrl}
            width={40}
            height={40}
            alt={row.name || "Imagem"}
          />
        );
      },
    },
    {
      title: "Nome",
      key: "name",
      width: "240px",
      normalCase: true,
      render: (gameSystem) => gameSystem.name || "-",
    },
    {
      title: "Descrição",
      key: "description",
      width: "320px",
      normalCase: true,
      render: (gameSystem) => gameSystem.description || "-",
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

  return (
    <>
      <CrmPageHeader
        title="Sistemas de Jogo"
        subtitle="Gerencie os sistemas de jogo cadastrados para criação de mesas."
        count={totalItems}
        actionLabel="Criar Sistema"
        actionIcon={<MdAdd />}
        onActionClick={() =>
          openModal("Criar Sistema de Jogo", <ModalEdit />, "md")
        }
        stats={[
          {
            title: "Total Sistemas",
            value: totalItems,
            badge: "Cadastrados",
            badgeType: "neutral",
          },
          {
            title: "Exibindo",
            value: data?.items?.length ?? 0,
            badge: "Página Atual",
            badgeType: "neutral",
          },
        ]}
      />

      <GameSystemsSearchFilters />

      <Table
        tableContents={tableContents}
        bodyData={data?.items ?? []}
        detailsLink="/gamesystems"
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
