import { Button } from "@/src/components/button/button";
import { ModalDelete } from "@/src/components/modals/modal-delete/modal-delete";
import { MoreInfo } from "@/src/components/more-info/more-info";
import { Paginate } from "@/src/components/paginate/paginate";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import { Table } from "@/src/components/table/table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { Thumbnail } from "@/src/components/thumbnail/thumbnail";
import { useAllBanners } from "@/src/features/banners/hooks/use-all-banners";
import { useBannersMutation } from "@/src/features/banners/hooks/use-banners-mutations";
import type { IBanner } from "@/src/features/banners/schemas/banner.schema";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";
import { useBoundStore } from "@/src/store";
import { MdAdd, MdDeleteForever, MdModeEdit } from "react-icons/md";
import { ModalEdit } from "./components/modal-edit/modal-edit";
import { SearchFilters as BannersSearchFilters } from "./components/search-filters/search-filters";

export function BannersPage() {
  const openModal = useBoundStore((state) => state.openModal);
  const { deleteMutation } = useBannersMutation();

  const { data, isLoading, isError, filters, setFilters } = useAllBanners();

  const getMoreInfoOptions = (item: IBanner): IMoreOptions[] => {
    const options = [
      {
        label: "Editar",
        icon: <MdModeEdit />,
        show: true,
        onClick: () =>
          openModal("Editar Banner", <ModalEdit data={item} />, "md"),
      },
      {
        label: "Deletar",
        icon: <MdDeleteForever />,
        show: true,
        onClick: () =>
          openModal(
            "Remover Banner",
            <ModalDelete
              name={item.title || "Banner"}
              id={item.id ?? 0}
              deleteMutation={deleteMutation}
            />,
            "sm",
          ),
      },
    ];

    return options.filter((opt) => opt.show);
  };

  const tableContents: ITableColumn<IBanner>[] = [
    {
      title: "ID",
      key: "id",
      width: "100px",
      align: "center",
      render: (banner) => (
        <span className="font-bold">{banner.id ?? "-"}</span>
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
            alt={row.title || "Imagem do banner"}
          />
        );
      },
    },
    {
      title: "Título",
      key: "title",
      width: "240px",
      normalCase: true,
      render: (banner) => banner.title || "-",
    },
    {
      title: "Link",
      key: "link",
      width: "200px",
      normalCase: true,
      render: (banner) => (
        banner.link ? (
          <span className="block max-w-[200px] truncate text-xs text-grays-200" title={banner.link}>
            {banner.link}
          </span>
        ) : (
          "-"
        )
      ),
    },
    {
      title: "Tag",
      key: "tag",
      width: "120px",
      align: "center",
      render: (banner) => (
        banner.tag ? (
          <span className="rounded bg-white/10 px-2 py-1 text-xs font-semibold text-white">
            {banner.tag}
          </span>
        ) : (
          "-"
        )
      ),
    },
    {
      title: "Ordem",
      key: "order",
      width: "100px",
      align: "center",
      render: (banner) => banner.order?.toString() || "0",
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
            Banners
          </h1>
          <p className="text-sm text-grays-100">
            Gerencie os banners para destaque no aplicativo.
          </p>
        </div>

        <Button
          buttonStyle="primary"
          size="sm"
          onClick={() => openModal("Criar Banner", <ModalEdit />, "md")}
        >
          <MdAdd />
          Criar Banner
        </Button>
      </header>

      <BannersSearchFilters />

      <Table
        tableContents={tableContents}
        bodyData={data?.items ?? []}
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
