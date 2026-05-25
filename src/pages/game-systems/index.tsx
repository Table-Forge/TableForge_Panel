import { Button } from "@/src/components/button/button";
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
import { formatDate } from "@/src/utils/format";
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
      title: "Criado em",
      key: "createdAt",
      width: "150px",
      align: "center",
      render: (gameSystem) =>
        gameSystem.createdAt ? formatDate(gameSystem.createdAt, true) : "-",
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
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
            Sistemas de Jogo
          </h1>
          <p className="text-sm text-grays-100">
            Gerencie os sistemas de jogo disponíveis para campanhas.
          </p>
        </div>

        <Button
          buttonStyle="primary"
          size="sm"
          onClick={() =>
            openModal("Criar Sistema de Jogo", <ModalEdit />, "md")
          }
        >
          <MdAdd />
          Criar Sistema
        </Button>
      </header>

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
