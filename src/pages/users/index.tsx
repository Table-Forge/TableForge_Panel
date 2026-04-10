import { Button, ModalDelete, MoreInfo, Paginate } from "@/src/components";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import { Table } from "@/src/components/table/table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { useUsers } from "@/src/features/users/hooks/use-users";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
import type { IUser } from "@/src/features/users/schemas/user.schema";
import type { IMoreOptions } from "@/src/interfaces";
import { useBoundStore } from "@/src/store";
import { formatDate } from "@/src/utils/format";
import { useMemo, useState } from "react";
import { MdAdd, MdDeleteForever, MdModeEdit } from "react-icons/md";
import { ModalEdit } from "./components/modal-edit/modal-edit";

const USERS_PAGE_SIZE = 20;

export default function UsersPage() {
  const openModal = useBoundStore((state) => state.openModal);
  const { deleteMutation } = useUsersMutation();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useUsers({
    page,
    size: USERS_PAGE_SIZE,
  });

  const users = data?.items ?? [];

  const paginationData = useMemo(
    () => ({
      page: data?.pagination?.page ?? page,
      itemsPerPage: data?.pagination?.itemsPerPage ?? USERS_PAGE_SIZE,
      filteredItems: data?.pagination?.filteredItems ?? users.length,
    }),
    [
      data?.pagination?.filteredItems,
      data?.pagination?.itemsPerPage,
      data?.pagination?.page,
      page,
      users.length,
    ],
  );

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
      render: (user) => <span className="font-bold">#{user.id}</span>,
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
      render: (user) => {
        const status = (user.status || "indefinido").toLowerCase();
        const styles: Record<string, string> = {
          ativo: "bg-green-500/10 text-green-400 border-green-500/30",
          inativo: "bg-danger/10 text-danger border-danger/30",
          indefinido: "bg-secondary/10 text-secondary border-secondary/30",
        };

        return (
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${
              styles[status] ?? styles.indefinido
            }`}
          >
            {status}
          </span>
        );
      },
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

  return (
    <>
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
            Usuários
          </h1>
          <p className="text-sm text-grays-100">
            Seus usuários disponíveis para administração.
          </p>
        </div>
        <Button
          buttonStyle="primary"
          size="sm"
          onClick={() => openModal("Criar Usuário", <ModalEdit />, "md")}
        >
          <MdAdd />
          Criar Usuário
        </Button>
      </header>

      <div className="mt-6">
        <Table
          tableContents={tableContents}
          bodyData={users}
          bodyHeight="calc(100vh - 280px)"
        />
      </div>

      <Paginate paginationData={paginationData} onPageChange={setPage} />
    </>
  );
}
