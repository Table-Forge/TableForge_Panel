import { CrmPageHeader } from "@/src/components/crm-page-header/crm-page-header";
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
          <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-white">
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

  const totalItems = data?.pagination?.filteredItems ?? data?.items?.length ?? 0;

  return (
    <>
      <CrmPageHeader
        title="Banners"
        subtitle="Gerencie os banners para destaque no aplicativo."
        count={totalItems}
        actionLabel="Criar Banner"
        actionIcon={<MdAdd />}
        onActionClick={() => openModal("Criar Banner", <ModalEdit />, "md")}
        stats={[
          {
            title: "Total Banners",
            value: totalItems,
            badge: "Ativos",
            badgeType: "success",
          },
          {
            title: "Exibindo",
            value: data?.items?.length ?? 0,
            badge: "Página Atual",
            badgeType: "neutral",
          },
        ]}
      />

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
