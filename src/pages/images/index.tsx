import { Button } from "@/src/components/button/button";
import { ModalDelete } from "@/src/components/modals/modal-delete/modal-delete";
import { MoreInfo } from "@/src/components/more-info/more-info";
import { Paginate } from "@/src/components/paginate/paginate";
import { Table } from "@/src/components/table/table";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { Thumbnail } from "@/src/components/thumbnail/thumbnail";
import { useAllImages } from "@/src/features/images/hooks/use-all-images";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
import type { IImage } from "@/src/features/images/schemas/image.schema";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";
import { useBoundStore } from "@/src/store";
import { formatDate } from "@/src/utils/format";
import { MdAdd, MdDeleteForever, MdModeEdit } from "react-icons/md";
import { CopyButton } from "@/src/components/copy-button/copy-button";
import { ModalEdit } from "./components/modal-edit/modal-edit";
import { ImagesSearchFilters } from "./components/search-filters/search-filters";

export default function ImagesPage() {
  const openModal = useBoundStore((state) => state.openModal);
  const { deleteMutation } = useImagesMutation();

  const { data, isLoading, isError, filters, setFilters } =
    useAllImages();

  const getMoreInfoOptions = (item: IImage): IMoreOptions[] => {
    const options = [
      {
        label: "Editar",
        icon: <MdModeEdit />,
        show: true,
        onClick: () =>
          openModal("Editar Imagem", <ModalEdit data={item} />, "md"),
      },
      {
        label: "Deletar",
        icon: <MdDeleteForever />,
        show: true,
        onClick: () =>
          openModal(
            "Remover Imagem",
            <ModalDelete
              name={item.name || "Imagem"}
              id={item.id ?? 0}
              deleteMutation={deleteMutation}
            />,
            "sm",
          ),
      },
    ];

    return options.filter((opt) => opt.show);
  };

  const tableContents: ITableColumn<IImage>[] = [
    {
      title: "ID",
      key: "id",
      width: "100px",
      render: (image) => <span className="font-bold">{image.id ?? "-"}</span>,
    },
    {
      title: "Prévia",
      key: "url",
      width: "100px",
      align: "center",
      normalCase: true,
      render: (image) => (
        <Thumbnail image={image} width={40} height={40} alt={image.name} />
      ),
    },
    {
      title: "Tipo",
      key: "type",
      width: "180px",
      normalCase: true,
      render: (image) => image.type || "-",
    },
    {
      title: "Nome",
      key: "name",
      width: "240px",
      normalCase: true,
      render: (image) => image.name || "-",
    },
    {
      title: "Link",
      key: "link",
      width: "240px",
      normalCase: true,
      render: (image) =>
        image.url ? (
          <div className="flex items-center gap-2">
            <span className="truncate max-w-[180px]" title={image.url}>
              {image.url}
            </span>
            <CopyButton text={image.url} title="Copiar link" />
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Criado em",
      key: "createdAt",
      width: "150px",
      align: "center",
      render: (image) =>
        image.createdAt ? formatDate(image.createdAt, true) : "-",
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
            Imagens
          </h1>
          <p className="text-sm text-grays-100">
            Gerencie os recursos de imagem disponíveis no sistema.
          </p>
        </div>

        <Button
          buttonStyle="primary"
          size="sm"
          onClick={() => openModal("Nova Imagem", <ModalEdit />, "md")}
        >
          <MdAdd />
          Nova Imagem
        </Button>
      </header>

      <ImagesSearchFilters />

      <Table
        tableContents={tableContents}
        bodyData={data?.items ?? []}
        detailsLink="/images"
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



