import { CrmPageHeader } from "@/src/components/crm-page-header/crm-page-header";
import { ModalDelete } from "@/src/components/modals/modal-delete/modal-delete";
import { MoreInfo } from "@/src/components/more-info/more-info";
import { Paginate } from "@/src/components/paginate/paginate";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import { Table } from "@/src/components/table/table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { useAllClasses } from "@/src/features/classes/hooks/use-all-classes";
import { useClassesMutation } from "@/src/features/classes/hooks/use-classes-mutations";
import type { IClass } from "@/src/features/classes/schemas/class.schema";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";
import { useBoundStore } from "@/src/store";
import { MdAdd, MdDeleteForever, MdModeEdit } from "react-icons/md";
import { ModalEdit } from "./components/modal-edit/modal-edit";
import { ClassesSearchFilters } from "./components/search-filters/search-filters";

export function ClassesPage() {
  const openModal = useBoundStore((state) => state.openModal);
  const { deleteMutation } = useClassesMutation();

  const { data, isLoading, isError, filters, setFilters } = useAllClasses();

  const getMoreInfoOptions = (item: IClass): IMoreOptions[] => {
    const options = [
      {
        label: "Editar",
        icon: <MdModeEdit />,
        show: true,
        onClick: () =>
          openModal("Editar Classe", <ModalEdit data={item} />, "md"),
      },
      {
        label: "Deletar",
        icon: <MdDeleteForever />,
        show: true,
        onClick: () =>
          openModal(
            "Remover Classe",
            <ModalDelete
              name={item.name || "Classe"}
              id={item.id ?? 0}
              deleteMutation={deleteMutation}
            />,
            "sm",
          ),
      },
    ];

    return options.filter((opt) => opt.show);
  };

  const tableContents: ITableColumn<IClass>[] = [
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
  if (isError) return <InfoNotFound message="Ocorreu um erro ao carregar as classes." />;

  const totalItems = data?.pagination?.filteredItems ?? data?.items?.length ?? 0;

  return (
    <>
      <CrmPageHeader
        title="Classes"
        subtitle="Gerencie as classes de personagem disponíveis para aventuras."
        count={totalItems}
        actionLabel="Criar Classe"
        actionIcon={<MdAdd />}
        onActionClick={() => openModal("Criar Classe", <ModalEdit />, "md")}
        stats={[
          {
            title: "Total de Classes",
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

      <ClassesSearchFilters />

      <Table
        tableContents={tableContents}
        bodyData={data?.items ?? []}
        emptyMessage="Nenhuma classe encontrada."
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
