import { useState, useMemo } from "react";
import { useAuth } from "@/src/context/use-auth";
import { useAllBookings } from "@/src/features/spaces/hooks/use-spaces-queries";
import { BookingsTable } from "./components/bookings-table/bookings-table";
import { BookingsSearchFilters, type IBookingParams } from "./components/search-filters/search-filters";
import { Paginate } from "@/src/components/paginate/paginate";
import { CrmPageHeader } from "@/src/components/crm-page-header/crm-page-header";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";

export function MyBookingsPage() {
  const { user } = useAuth();

  const [queryParams, setQueryParams] = useState<IBookingParams>({
    page: 1,
    size: 10,
    search: "",
    status: undefined,
  });

  const isOrganizer = user?.type === "Organizer";

  const { data, isLoading, bookingsQuery } = useAllBookings(
    {
      ...queryParams,
      spaceOwnerId: isOrganizer ? user?.id : undefined,
    },
    !!user?.id
  );

  const isError = bookingsQuery.isError;

  const totalItems = data?.pagination?.filteredItems ?? data?.items?.length ?? 0;

  const pendingCount = useMemo(
    () => data?.items?.filter((b) => b.status === "Pending")?.length ?? 0,
    [data?.items]
  );

  const approvedCount = useMemo(
    () => data?.items?.filter((b) => b.status === "Approved")?.length ?? 0,
    [data?.items]
  );

  if (isLoading) return <SkeletonTable />;

  return (
    <>
      <CrmPageHeader
        title="Agendamentos"
        subtitle="Acompanhe e gerencie as solicitações de reserva para as mesas do seu espaço."
        count={totalItems}
        stats={[
          {
            title: "Total Reservas",
            value: totalItems,
            badge: "Geral",
            badgeType: "neutral",
          },
          {
            title: "Pendentes",
            value: pendingCount,
            badge: "Aguardando",
            badgeType: "warning",
          },
          {
            title: "Aprovados",
            value: approvedCount,
            badge: "Confirmados",
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

      <BookingsSearchFilters
        filters={queryParams}
        onSearchChange={(search) =>
          setQueryParams((prev) => ({ ...prev, search, page: 1 }))
        }
        onFilterChange={(newFilters) =>
          setQueryParams((prev) => ({ ...prev, ...newFilters, page: 1 }))
        }
        onReset={() =>
          setQueryParams({ page: 1, size: 10, search: "", status: undefined })
        }
      />

      {isError || !data?.items?.length ? (
        <InfoNotFound message="Nenhum agendamento encontrado." />
      ) : (
        <>
          <BookingsTable data={data.items} />
          <Paginate
            paginationData={data.pagination}
            onPageChange={(page) => setQueryParams((prev) => ({ ...prev, page }))}
          />
        </>
      )}
    </>
  );
}
