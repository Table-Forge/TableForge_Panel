import { Button } from "@/src/components/button/button";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import { Table } from "@/src/components/table/table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { Thumbnail } from "@/src/components/thumbnail/thumbnail";
import { SpaceBookingStatus } from "@/src/features/spaces/components/space-booking-status";
import type { ISpaceBooking } from "@/src/features/spaces/schemas/spaces.schema";
import { formatDate } from "@/src/utils/format";
import { MdRemoveRedEye } from "react-icons/md";
import { useBoundStore } from "@/src/store";
import { ModalBookingDetails } from "../modal-booking-details/modal-booking-details";

interface IProps {
  data: ISpaceBooking[];
  isLoading: boolean;
}

export function BookingsTable({ data, isLoading }: IProps) {
  const openModal = useBoundStore((state) => state.openModal);

  const tableContents: ITableColumn<ISpaceBooking>[] = [
    {
      title: "Cliente",
      key: "userName",
      width: "220px",
      normalCase: true,
      render: (booking) => (
        <div className="flex items-center gap-3">
          <Thumbnail
            image={booking.userAvatarUrl}
            alt={booking.userName || "Avatar"}
            width={32}
            height={32}
          />
          <span className="font-medium text-white">
            {booking.userName || `Usuário #${booking.userId}`}
          </span>
        </div>
      ),
    },
    {
      title: "Data",
      key: "bookingDate",
      width: "140px",
      render: (booking) => formatDate(booking.bookingDate),
    },
    {
      title: "Horário",
      key: "startTime",
      width: "140px",
      render: (booking) => `${booking.startTime} - ${booking.endTime}`,
    },
    {
      title: "Jogadores",
      key: "playerCount",
      width: "110px",
      align: "center",
      render: (booking) => booking.playerCount,
    },
    {
      title: "Status",
      key: "status",
      width: "160px",
      render: (booking) => <SpaceBookingStatus value={booking.status} />,
    },
    {
      title: "",
      key: "actions",
      width: "140px",
      align: "right",
      render: (booking) => (
        <Button
          buttonStyle="hollow"
          size="sm"
          onClick={() =>
            openModal(
              "Detalhes do Agendamento",
              <ModalBookingDetails booking={booking} />,
              "md",
            )
          }
        >
          <MdRemoveRedEye />
          Ver Detalhes
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <SkeletonTable />;
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-secondary/20 bg-secondary/10 p-10 text-center">
        <p className="text-grays-100">Nenhum agendamento encontrado.</p>
      </div>
    );
  }

  return (
    <Table
      tableContents={tableContents}
      bodyData={data}
      bodyHeight="100%"
      detailsLink=""
    />
  );
}
