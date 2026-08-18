import { Button } from "@/src/components/button/button";
import { ModalDelete } from "@/src/components/modals/modal-delete/modal-delete";
import { MoreInfo } from "@/src/components/more-info/more-info";
import { Paginate } from "@/src/components/paginate/paginate";
import { Table } from "@/src/components/table/table";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { Thumbnail } from "@/src/components/thumbnail/thumbnail";
import { useEvents } from "@/src/features/events/hooks/use-events-queries";
import { useEventMutations } from "@/src/features/events/hooks/use-events-mutations";
import type { IEvent } from "@/src/features/events/schemas/events.schema";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";
import { useBoundStore } from "@/src/store";
import { MdAdd, MdDeleteForever, MdModeEdit } from "react-icons/md";
import { useEventStatusEnum } from "@/src/features/events/hooks/enums/use-event-status-enum";
import { EventForm } from "@/src/components/events/event-form";
import { useAuth } from "@/src/context/use-auth";
import { useState } from "react";

export function EventsPage() {
  const { user } = useAuth();
  const openModal = useBoundStore((state) => state.openModal);
  const { deleteMutation } = useEventMutations();

  const [statusFilter, setStatusFilter] = useState<string[]>(["Published"]);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useEvents({
    organizerId: user?.id,
    status: statusFilter[0] !== "All" ? statusFilter[0] : undefined,
    onlyUpcoming: false,
    page,
    size: 20,
  });

  const { data: eventStatusEnum } = useEventStatusEnum();

  const getMoreInfoOptions = (item: IEvent): IMoreOptions[] => {
    const isCanceled = item.status === "Canceled";

    const options = [
      {
        label: "Editar",
        icon: <MdModeEdit />,
        show: !isCanceled,
        onClick: () =>
          openModal("Editar Evento", <EventForm data={item} />, "md"),
      },
      {
        label: "Cancelar Evento",
        icon: <MdDeleteForever />,
        show: !isCanceled,
        onClick: () =>
          openModal(
            "Cancelar Evento",
            <ModalDelete
              name={item.title || "Evento"}
              id={item.id ?? 0}
              deleteMutation={deleteMutation}
              customMessage="Tem certeza de que deseja cancelar este evento? Todos os participantes serão notificados automaticamente."
            />,
            "sm",
          ),
      },
    ];

    return options.filter((opt) => opt.show);
  };

  const tableContents: ITableColumn<IEvent>[] = [
    {
      title: "ID",
      key: "id",
      width: "90px",
      align: "center",
      render: (event) => (
        <span className="font-bold">{event.id ?? "-"}</span>
      ),
    },
    {
      title: "Capa",
      key: "bannerUrl",
      width: "100px",
      align: "center",
      normalCase: true,
      render: (event) => (
        <Thumbnail
          image={event.bannerUrl}
          width={40}
          height={40}
          alt={event.title || "Capa"}
        />
      ),
    },
    {
      title: "Título",
      key: "title",
      width: "220px",
      normalCase: true,
      render: (event) => event.title || "-",
    },
    {
      title: "Data de Início",
      key: "startDate",
      width: "180px",
      normalCase: true,
      render: (event) => new Date(event.startDate).toLocaleString("pt-BR") || "-",
    },
    {
      title: "Status",
      key: "status",
      width: "180px",
      normalCase: true,
      render: (event) => event.status ? eventStatusEnum?.find(o => o.value === event.status)?.label || event.status : "-",
    },
    {
      title: "Confirmados / Limite",
      key: "maxAttendees",
      width: "140px",
      align: "center",
      render: (event) => `${event.confirmedAttendeesCount ?? 0} / ${event.maxAttendees || "Sem limite"}`,
    },
    {
      title: "Valor",
      key: "isFree",
      width: "110px",
      align: "center",
      normalCase: true,
      render: (event) => (event.isFree ? "Gratuito" : `R$ ${event.entryFee?.toFixed(2)}`),
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

  return (
    <>
      <header className="shrink-0 flex flex-col items-start justify-between gap-4 sm:flex-row mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
            Eventos
          </h1>
          <p className="text-sm text-grays-100">
            Crie e gerencie os eventos do seu espaço ou da sua comunidade.
          </p>
        </div>

        <Button
          buttonStyle="primary"
          size="sm"
          onClick={() => openModal("Criar Evento", <EventForm />, "md")}
        >
          <MdAdd />
          Criar Evento
        </Button>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {[{ label: "Todos", value: "All" }, ...(eventStatusEnum || [])].map((opt) => {
          const isSelected = statusFilter[0] === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setStatusFilter([opt.value]);
                setPage(1);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                isSelected
                  ? "bg-secondary text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {isError || !data?.items.length ? (
        <InfoNotFound message="Nenhum evento encontrado." />
      ) : (
        <>
          <Table
            tableContents={tableContents}
            bodyData={data.items}
            bodyHeight="100%"
            detailsLink=""
          />

          <Paginate
            paginationData={data.pagination}
            onPageChange={setPage}
          />
        </>
      )}
    </>
  );
}
