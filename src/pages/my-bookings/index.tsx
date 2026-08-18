import { useState } from "react";
import { useAuth } from "@/src/context/use-auth";
import { useAllBookings } from "@/src/features/spaces/hooks/use-spaces-queries";
import { BookingsTable } from "./components/bookings-table/bookings-table";
import { SearchFilters } from "./components/search-filters/search-filters";
import { Paginate } from "@/src/components/paginate/paginate";
import type { IGetPaginatedParams } from "@/src/interfaces";

export function MyBookingsPage() {
  const { user } = useAuth();
  
  const [queryParams, setQueryParams] = useState<IGetPaginatedParams>({
    page: 1,
    size: 10,
    search: "",
  });

  const { data, isLoading } = useAllBookings({
    ...queryParams,
    spaceOwnerId: user?.id, // Assumindo que a API aceita filtrar pelo spaceOwnerId
  }, !!user?.id);

  const handleSearchChange = (search: string) => {
    setQueryParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleStatusChange = (status: string) => {
    setQueryParams((prev) => ({ ...prev, status, page: 1 }));
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
            Meus Agendamentos
          </h1>
          <p className="text-sm text-grays-100">
            Acompanhe os pedidos de reserva para as mesas do seu espaço.
          </p>
        </div>
      </header>

      <SearchFilters 
        onSearchChange={handleSearchChange} 
        onStatusChange={handleStatusChange} 
      />

      <BookingsTable data={data?.items ?? []} isLoading={isLoading} />

      {data && data.items.length > 0 && (
        <Paginate
          paginationData={data.pagination}
          onPageChange={(page) => setQueryParams((prev) => ({ ...prev, page }))}
        />
      )}
    </div>
  );
}
