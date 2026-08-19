import { CrmPageHeader } from "@/src/components/crm-page-header/crm-page-header";
import { ModalDelete } from "@/src/components/modals/modal-delete/modal-delete";
import { MoreInfo } from "@/src/components/more-info/more-info";
import { Paginate } from "@/src/components/paginate/paginate";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import { Table } from "@/src/components/table/table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { useAllRaces } from "@/src/features/races/hooks/use-all-races";
import { useRacesMutation } from "@/src/features/races/hooks/use-races-mutations";
import type { IRace } from "@/src/features/races/schemas/race.schema";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";
import { useBoundStore } from "@/src/store";
import { MdAdd, MdDeleteForever, MdModeEdit } from "react-icons/md";
import { ModalEdit } from "./components/modal-edit/modal-edit";
import { RacesSearchFilters } from "./components/search-filters/search-filters";

export function RacesPage() {
  const openModal = useBoundStore((state) => state.openModal);
  const { deleteMutation } = useRacesMutation();

  const { data, isLoading, isError, filters, setFilters } = useAllRaces();

  const getMoreInfoOptions = (item: IRace): IMoreOptions[] => {
    const options = [
      {
        label: "Editar",
        icon: <MdModeEdit />,
        show: true,
        onClick: () =>
          openModal("Editar Raça", <ModalEdit data={item} />, "md"),
      },
      {
        label: "Deletar",
        icon: <MdDeleteForever />,
        show: true,
        onClick: () =>
          openModal(
            "Remover Raça",
            <ModalDelete
              name={item.name || "Raça"}
              id={item.id ?? 0}
              deleteMutation={deleteMutation}
            />,
            "sm",
          ),
      },
    ];

    return options.filter((opt) => opt.show);
  };

  const tableContents: ITableColumn<IRace>[] = [
    {
      title: "ID",
      key: "id",
      width: "100px",
      align: "center",
      render: (item) => <span className="font-bold">{item.id ?? "-"}</span>,
    },
    {
      title: "Nome",
      key: "name",
      width: "240px",
      normalCase: true,
      render: (item) => item.name || "-",
    },
    {
      title: "Descrição",
      key: "description",
      width: "320px",
      normalCase: true,
      render: (item) => item.description || "-",
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
  if (isError) return <InfoNotFound message="Ocorreu um erro ao carregar as raças." />;

  const totalItems = data?.pagination?.filteredItems ?? data?.items?.length ?? 0;

  return (
    <>
      <CrmPageHeader
        title="Raças"
        subtitle="Gerencie as raças de personagem configuradas no sistema."
        count={totalItems}
        actionLabel="Criar Raça"
        actionIcon={<MdAdd />}
        onActionClick={() => openModal("Criar Raça", <ModalEdit />, "md")}
        stats={[
          {
            title: "Total de Raças",
            value: totalItems,
            badge: "Cadastradas",
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

      <RacesSearchFilters />

      <Table
        tableContents={tableContents}
        bodyData={data?.items ?? []}
        emptyMessage="Nenhuma raça encontrada."
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
