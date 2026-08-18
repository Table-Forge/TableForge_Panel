import { CrmPageHeader } from "@/src/components/crm-page-header/crm-page-header";
import { ModalDelete } from "@/src/components/modals/modal-delete/modal-delete";
import { MoreInfo } from "@/src/components/more-info/more-info";
import { Paginate } from "@/src/components/paginate/paginate";
import { Table } from "@/src/components/table/table";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { Thumbnail } from "@/src/components/thumbnail/thumbnail";
import { UserStatus } from "@/src/components/user-status/user-status";
import { useUserStatusEnum } from "@/src/features/users/hooks/enums/use-user-status-enum";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
import { useAllUsers } from "@/src/features/users/hooks/use-all-users";
import type { IUser } from "@/src/features/users/schemas/user.schema";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";
import { useBoundStore } from "@/src/store";
import { formatDate } from "@/src/utils/format";
import { MdAdd, MdDeleteForever, MdModeEdit } from "react-icons/md";
import { ModalEdit } from "./components/modal-edit/modal-edit";
import { UsersSearchFilters } from "./components/search-filters/search-filters";

export default function UsersPage() {
  const openModal = useBoundStore((state) => state.openModal);
  const { deleteMutation } = useUsersMutation();
  const { statusEnum } = useUserStatusEnum();

  const { data, isLoading, isError, filters, setFilters } = useAllUsers();

  const getMoreInfoOptions = (item: IUser): IMoreOptions[] => {
    const options = [
      {
        label: "Editar",
        icon: <MdModeEdit />,
        show: true,
        onClick: () =>
          openModal("Editar Usuário", <ModalEdit data={item} />, "md"),
      },
      {
        label: "Deletar",
        icon: <MdDeleteForever />,
        show: true,
        onClick: () =>
          openModal(
            "Remover Usuário",
            <ModalDelete
              name={item.username ?? "Usuário"}
              id={item.id!}
              deleteMutation={deleteMutation}
            />,
            "sm",
          ),
      },
    ];

    return options.filter((opt) => opt.show);
  };

  const tableContents: ITableColumn<IUser>[] = [
    {
      title: "ID",
      key: "id",
      width: "120px",
      render: (user) => <span className="font-bold">{user.id}</span>,
    },
    {
      title: "Avatar",
      key: "avatarUrl",
      width: "100px",
      align: "center",
      normalCase: true,
      render: (user) => (
        <Thumbnail
          image={user.avatarUrl}
          width={40}
          height={40}
          alt={user.nickname || user.username || "Avatar"}
        />
      ),
    },
    {
      title: "Usuário",
      key: "username",
      width: "220px",
      normalCase: true,
      render: (user) => user.username || "-",
    },
    {
      title: "Nickname",
      key: "nickname",
      width: "220px",
      normalCase: true,
      render: (user) => user.nickname || "-",
    },
    {
      title: "E-mail",
      key: "email",
      width: "260px",
      normalCase: true,
      render: (user) => user.email || "-",
    },
    {
      title: "Status",
      key: "status",
      width: "140px",
      align: "center",
      render: (user) => <UserStatus value={user.status} options={statusEnum} />,
    },
    {
      title: "Criado em",
      key: "createdAt",
      width: "140px",
      align: "center",
      render: (user) => (user.createdAt ? formatDate(user.createdAt) : "-"),
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
  const activeCount = data?.items?.filter((u) => u.status === 1 || u.status === "Active")?.length ?? 0;

  return (
    <>
      <CrmPageHeader
        title="Usuários"
        subtitle="Gerencie os usuários do sistema, perfis e permissões."
        count={totalItems}
        actionLabel="Criar Usuário"
        actionIcon={<MdAdd />}
        onActionClick={() => openModal("Criar Usuário", <ModalEdit />, "md")}
        stats={[
          {
            title: "Total Usuários",
            value: totalItems,
            badge: "Cadastrados",
            badgeType: "neutral",
          },
          {
            title: "Ativos",
            value: activeCount,
            badge: "Online",
            badgeType: "success",
          },
          {
            title: "Página Atual",
            value: data?.items?.length ?? 0,
            badge: "Registros",
            badgeType: "neutral",
          },
        ]}
      />

      <UsersSearchFilters />

      <Table
        tableContents={tableContents}
        bodyData={data?.items ?? []}
        detailsLink="/users"
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
