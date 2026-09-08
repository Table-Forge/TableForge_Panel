import { CrmPageHeader } from "@/src/components/crm-page-header/crm-page-header";
import { ModalDelete } from "@/src/components/modals/modal-delete/modal-delete";
import { MoreInfo } from "@/src/components/more-info/more-info";
import { Table } from "@/src/components/table/table";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { Thumbnail } from "@/src/components/thumbnail/thumbnail";
import { useAuth } from "@/src/context/use-auth";
import { useAllSpaces } from "@/src/features/spaces/hooks/use-spaces-queries";
import { useSpaceMutations } from "@/src/features/spaces/hooks/use-spaces-mutations";
import type { ISpaceList } from "@/src/features/spaces/schemas/spaces.schema";
import { SpaceStatus } from "@/src/features/spaces/components/space-status";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";
import { useBoundStore } from "@/src/store";
import { MdAdd, MdDeleteForever, MdModeEdit, MdVisibility } from "react-icons/md";
import { Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/src/components/button/button";
import { ModalEditSpace } from "./components/modal-edit-space/modal-edit-space";

export function MySpacesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const openModal = useBoundStore((state) => state.openModal);
  const { deleteSpaceMutation } = useSpaceMutations();

  const { spaces, isLoadingSpaces: isLoading, allSpacesQuery } = useAllSpaces(
    { ownerId: user?.id },
    !!user?.id
  );

  const getMoreInfoOptions = (item: ISpaceList): IMoreOptions[] => {
    return [
      {
        label: "Ver Detalhes",
        icon: <MdVisibility />,
        show: true,
        onClick: () => navigate(`/my-spaces/${item.id}`),
      },
      {
        label: "Editar",
        icon: <MdModeEdit />,
        show: true,
        onClick: () =>
          openModal("Editar Espaço", <ModalEditSpace data={item} />, "md"),
      },
      {
        label: "Deletar",
        icon: <MdDeleteForever />,
        show: true,
        onClick: () =>
          openModal(
            "Remover Espaço",
            <ModalDelete
              name={item.name || "Espaço"}
              id={item.id}
              deleteMutation={deleteSpaceMutation}
            />,
            "sm"
          ),
      },
    ];
  };

  const tableContents: ITableColumn<ISpaceList>[] = [
    {
      title: "ID",
      key: "id",
      width: "90px",
      align: "center",
      render: (space) => <span className="font-bold">{space.id}</span>,
    },
    {
      title: "Banner",
      key: "bannerUrl",
      width: "100px",
      align: "center",
      normalCase: true,
      render: (space) => (
        <Thumbnail
          image={space.bannerUrl}
          width={40}
          height={40}
          alt={space.name || "Banner"}
        />
      ),
    },
    {
      title: "Nome",
      key: "name",
      width: "200px",
      normalCase: true,
      render: (space) => (
        <span className="font-semibold text-white">{space.name || "-"}</span>
      ),
    },
    {
      title: "Telefone",
      key: "phoneNumber",
      width: "140px",
      normalCase: true,
      render: (space) => space.phoneNumber || "-",
    },
    {
      title: "Endereço",
      key: "address",
      width: "220px",
      normalCase: true,
      render: (space) => space.address || "-",
    },
    {
      title: "Horários",
      key: "openTime",
      width: "150px",
      normalCase: true,
      render: (space) =>
        space.openTime && space.closeTime
          ? `${space.openTime} às ${space.closeTime}`
          : space.openTime || "-",
    },
    {
      title: "Mesas Ativas",
      key: "activeTableCount",
      width: "110px",
      align: "center",
      render: (space) => space.activeTableCount ?? 0,
    },
    {
      title: "Status",
      key: "status",
      width: "140px",
      render: (space) => <SpaceStatus value={space.status} />,
    },
    {
      title: "",
      key: "moreOptions",
      width: "50px",
      align: "center",
      render: (row) => (
        <MoreInfo
          item={row as unknown as Record<string, unknown>}
          options={getMoreInfoOptions(row)}
          boxSide="right"
        />
      ),
    },
  ];

  if (isLoading) return <SkeletonTable />;

  if (allSpacesQuery.isError) {
    return (
      <InfoNotFound message="Ocorreu um erro ao carregar os espaços." />
    );
  }

  const totalItems = spaces?.length ?? 0;
  const activeCount = spaces?.filter((s) => s.status === "Active")?.length ?? 0;

  if (totalItems === 0) {
    return (
      <div className="flex flex-col gap-6">
        <CrmPageHeader
          title="Meus Espaços"
          subtitle="Gerencie seus espaços físicos, mesas e agendamentos."
          count={0}
          actionLabel="Cadastrar Espaço"
          actionIcon={<MdAdd />}
          onActionClick={() => openModal("Criar Espaço", <ModalEditSpace />, "md")}
        />

        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-primary/40 p-8 text-center backdrop-blur-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-secondary">
            <Store size={32} />
          </div>
          <h2 className="text-xl font-extrabold uppercase text-white">
            Nenhum Espaço Cadastrado
          </h2>
          <p className="max-w-md text-xs font-semibold text-grays-100 leading-relaxed">
            Você ainda não possui um espaço físico cadastrado no sistema. Crie o seu espaço para gerenciar mesas, horários e agendamentos dos seus clientes.
          </p>
          <Button
            buttonStyle="primary"
            size="md"
            onClick={() => openModal("Criar Espaço", <ModalEditSpace />, "md")}
            className="mt-2 !rounded-2xl shadow-lg hover:shadow-secondary/20"
          >
            <MdAdd />
            Cadastrar Meu Espaço
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <CrmPageHeader
        title="Meus Espaços"
        subtitle="Gerencie seus espaços físicos, mesas e agendamentos dos seus clientes."
        count={totalItems}
        actionLabel="Cadastrar Espaço"
        actionIcon={<MdAdd />}
        onActionClick={() => openModal("Criar Espaço", <ModalEditSpace />, "md")}
        stats={[
          {
            title: "Total de Espaços",
            value: totalItems,
            badge: "Geral",
            badgeType: "neutral",
          },
          {
            title: "Espaços Ativos",
            value: activeCount,
            badge: "Disponíveis",
            badgeType: "success",
          },
          {
            title: "Exibindo",
            value: totalItems,
            badge: "Lista",
            badgeType: "neutral",
          },
        ]}
      />

      <Table
        tableContents={tableContents}
        bodyData={spaces}
        bodyHeight="100%"
        detailsLink="/my-spaces"
        emptyMessage="Nenhum espaço encontrado."
      />
    </div>
  );
}
