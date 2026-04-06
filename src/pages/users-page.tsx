import { useMemo } from "react";
import { Table } from "@/src/components/table/table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { useUsers } from "@/src/features/users/hooks/use-users";
import type { IUser } from "@/src/features/users/schemas/user.schema";

interface IUserListItem extends Omit<IUser, "id"> {
  id: string | number;
}

function formatDate(value?: Date) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("pt-BR");
}

export function UsersPage() {
  const { data = [], isLoading, isError } = useUsers();

  const users = useMemo<IUserListItem[]>(
    () =>
      data.map((user, index) => ({
        ...user,
        id: user.id ?? user.email ?? `usuario-${index + 1}`,
      })),
    [data],
  );

  const tableColumns: ITableColumn<IUserListItem>[] = [
    {
      title: "Código",
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
      render: (user) => formatDate(user.createdAt),
    },
  ];

  if (isLoading) return <SkeletonTable />;
  if (isError) return <InfoNotFound />;

  return (
    <section id="users" className="p-6">
      <header>
        <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
          Usuários
        </h1>
        <p className="text-sm text-grays-100">
          Seus usuários disponíveis para administração.
        </p>
      </header>

      <div className="mt-6">
        <Table<IUserListItem>
          headerData={tableColumns}
          bodyData={users}
          bodyHeight="calc(100vh - 280px)"
        />
      </div>
    </section>
  );
}
