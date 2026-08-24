import { CrmPageHeader } from "@/src/components/crm-page-header/crm-page-header";
import { ModalDelete } from "@/src/components/modals/modal-delete/modal-delete";
import { MoreInfo } from "@/src/components/more-info/more-info";
import { Table } from "@/src/components/table/table";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { Thumbnail } from "@/src/components/thumbnail/thumbnail";
import { useAllSpaces } from "@/src/features/spaces/hooks/use-spaces-queries";
import { useSpaceMutations } from "@/src/features/spaces/hooks/use-spaces-mutations";
import type { ISpaceList } from "@/src/features/spaces/schemas/spaces.schema";
import { SpaceStatus } from "@/src/features/spaces/components/space-status";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";
import { useBoundStore } from "@/src/store";
import { MdAdd, MdDeleteForever, MdModeEdit, MdVisibility } from "react-icons/md";
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/src/components/button/button";
import { ModalEditSpace } from "@/src/pages/my-spaces/components/modal-edit-space/modal-edit-space";

export function AllSpacesPage() {
  const navigate = useNavigate();
  const openModal = useBoundStore((state) => state.openModal);
  const { deleteSpaceMutation } = useSpaceMutations();

  const { spaces, isLoadingSpaces: isLoading, allSpacesQuery } = useAllSpaces();

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
      width: "80px",
      align: "center",
      render: (space) => <span className="font-bold">{space.id}</span>,
    },
    {
      title: "Banner",
      key: "bannerUrl",
      width: "90px",
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
      width: "180px",
      normalCase: true,
      render: (space) => (
        <span className="font-semibold text-white">{space.name || "-"}</span>
      ),
    },
    {
      title: "Proprietário",
      key: "ownerName",
      width: "180px",
      normalCase: true,
      render: (space) => (
        <div className="flex flex-col">
          <span className="font-medium text-white">{space.ownerName || "Não informado"}</span>
          <span className="text-[10px] text-grays-100 font-semibold">ID: #{space.ownerId}</span>
        </div>
      ),
    },
    {
      title: "Telefone",
      key: "phoneNumber",
      width: "130px",
      normalCase: true,
      render: (space) => space.phoneNumber || "-",
    },
    {
      title: "Endereço",
      key: "address",
      width: "200px",
      normalCase: true,
      render: (space) => space.address || "-",
    },
    {
      title: "Horários",
      key: "openTime",
      width: "140px",
      normalCase: true,
      render: (space) =>
        space.openTime && space.closeTime
          ? `${space.openTime} às ${space.closeTime}`
          : space.openTime || "-",
    },
    {
      title: "Mesas Ativas",
      key: "activeTableCount",
      width: "100px",
      align: "center",
      render: (space) => space.activeTableCount ?? 0,
    },
    {
      title: "Status",
      key: "status",
      width: "130px",
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
      <InfoNotFound message="Ocorreu um erro ao carregar todos os espaços." />
    );
  }

  const totalItems = spaces?.length ?? 0;
  const activeCount = spaces?.filter((s) => s.status === "Active")?.length ?? 0;

  if (totalItems === 0) {
    return (
      <div className="flex flex-col gap-6">
        <CrmPageHeader
          title="Todos os Espaços"
          subtitle="Gerencie e acompanhe todos os espaços físicos cadastrados no sistema (Visão Administrador)."
          count={0}
          actionLabel="Cadastrar Espaço"
          actionIcon={<MdAdd />}
          onActionClick={() => openModal("Criar Espaço", <ModalEditSpace />, "md")}
        />

        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-primary/40 p-8 text-center backdrop-blur-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-secondary">
            <Building2 size={32} />
          </div>
          <h2 className="text-xl font-extrabold uppercase text-white">
            Nenhum Espaço Encontrado
          </h2>
          <p className="max-w-md text-xs font-semibold text-grays-100 leading-relaxed">
            Nenhum espaço físico foi cadastrado no sistema até o momento.
          </p>
          <Button
            buttonStyle="primary"
            size="md"
            onClick={() => openModal("Criar Espaço", <ModalEditSpace />, "md")}
            className="mt-2 !rounded-2xl shadow-lg hover:shadow-secondary/20"
          >
            <MdAdd />
            Cadastrar Espaço
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <CrmPageHeader
        title="Todos os Espaços"
        subtitle="Gerencie e acompanhe todos os espaços físicos cadastrados no sistema (Visão Administrador)."
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
            title: "Visão Geral",
            value: totalItems,
            badge: "Modo Admin",
            badgeType: "warning",
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
