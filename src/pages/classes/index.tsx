import { Button } from "@/src/components/button/button";
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
import { formatDate } from "@/src/utils/format";
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
      title: "Criado em",
      key: "createdAt",
      width: "150px",
      align: "center",
      render: (item) => (item.createdAt ? formatDate(item.createdAt, true) : "-"),
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
            Classes
          </h1>
          <p className="text-sm text-grays-100">
            Gerencie as classes disponíveis para personagens.
          </p>
        </div>

        <Button
          buttonStyle="primary"
          size="sm"
          onClick={() => openModal("Criar Classe", <ModalEdit />, "md")}
        >
          <MdAdd />
          Criar Classe
        </Button>
      </header>

      <ClassesSearchFilters />

      <Table tableContents={tableContents} bodyData={data?.items ?? []} />

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
