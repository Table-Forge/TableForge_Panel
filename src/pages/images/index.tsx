import {
  Button,
  ModalDelete,
  MoreInfo,
  Paginate,
  Table,
} from "@/src/components";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { useImages } from "@/src/features/images/hooks/use-images";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
import type { IImage } from "@/src/features/images/schemas/image.schema";
import type { IMoreOptions } from "@/src/interfaces";
import { useBoundStore } from "@/src/store";
import { formatDate } from "@/src/utils/format";
import { useMemo, useState } from "react";
import { MdAdd, MdDeleteForever, MdModeEdit } from "react-icons/md";
import { ModalEdit } from "./components/modal-edit/modal-edit";

const IMAGES_PAGE_SIZE = 20;

const toImageSource = (value?: string) => {
  if (!value) return "";
  if (/^data:image\//i.test(value) || /^https?:\/\//i.test(value)) return value;
  return `data:image/*;base64,${value}`;
};

export default function ImagesPage() {
  const openModal = useBoundStore((state) => state.openModal);
  const { deleteMutation } = useImagesMutation();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useImages({
    page,
    size: IMAGES_PAGE_SIZE,
    search,
  });

  const images = data?.items ?? [];

  const paginationData = useMemo(
    () => ({
      page: data?.pagination?.page ?? page,
      itemsPerPage: data?.pagination?.itemsPerPage ?? IMAGES_PAGE_SIZE,
      filteredItems: data?.pagination?.filteredItems ?? images.length,
    }),
    [
      data?.pagination?.filteredItems,
      data?.pagination?.itemsPerPage,
      data?.pagination?.page,
      images.length,
      page,
    ],
  );

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
      title: "Preview",
      key: "url",
      width: "100px",
      align: "center",
      normalCase: true,
      render: (image) =>
        image.url ? (
          <img
            src={toImageSource(image.url)}
            alt={image.name}
            className="h-10 w-10 rounded-lg border border-white/15 object-cover"
          />
        ) : (
          "-"
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
      title: "UUID",
      key: "uuid",
      width: "240px",
      normalCase: true,
      render: (image) => image.uuid || "-",
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
            Gerencie os assets de imagem disponíveis no sistema.
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

      <div className="mt-4 rounded-2xl border border-white/10 bg-primary/55 p-3">
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Buscar imagem por nome ou tipo"
          className="h-10 w-full rounded-xl border border-white/15 bg-background/60 px-3 text-sm text-white outline-none placeholder:text-white/35"
        />
      </div>

      <div className="mt-6">
        <Table
          tableContents={tableContents}
          bodyData={images}
          bodyHeight="calc(100vh - 300px)"
        />
      </div>

      <Paginate paginationData={paginationData} onPageChange={setPage} />
    </>
  );
}
