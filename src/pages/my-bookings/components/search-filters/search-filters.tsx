import { Button } from "@/src/components/button/button";
import { Filters } from "@/src/components/filters/filters";
import { useFilterContext } from "@/src/components/filters/filters.context";
import { Input } from "@/src/components/input/input.default";
import { InputGroup } from "@/src/components/input-group/input-group";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { PAGE_SIZE } from "@/src/constants/select-options";
import { useBookingStatusEnum } from "@/src/features/spaces/hooks/enums/use-spaces-enums";
import type { IGetPaginatedParams } from "@/src/interfaces";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

export interface IBookingParams extends IGetPaginatedParams {
  status?: string;
  spaceOwnerId?: number;
}

interface IProps {
  filters: IBookingParams;
  onSearchChange: (search: string) => void;
  onFilterChange: (filters: Partial<IBookingParams>) => void;
  onReset: () => void;
}

function AdvancedFiltersContent({
  filters,
  onFilterChange,
  onReset,
}: {
  filters: IBookingParams;
  onFilterChange: (filters: Partial<IBookingParams>) => void;
  onReset: () => void;
}) {
  const { close } = useFilterContext();
  const { statusEnum, isLoadingStatusEnum } = useBookingStatusEnum();

  const statusOptions = useMemo<TSelectOptions[]>(
    () => [
      { id: "all", value: "", name: "Todos os Status", allowSelect: true },
      ...statusEnum,
    ],
    [statusEnum]
  );

  const form = useForm<IBookingParams>({
    defaultValues: {
      status: filters.status ?? "",
      size: filters.size ?? 10,
    },
  });

  const handleApply = (data: IBookingParams) => {
    onFilterChange(data);
    close();
  };

  const handleClear = () => {
    form.reset({ status: "", size: 10 });
    onReset();
    close();
  };

  return (
    <form onSubmit={form.handleSubmit(handleApply)} className="space-y-4">
      <InputGroup>
        <Label htmlFor="status">Status do Agendamento</Label>
        <Select
          hookForm={form}
          name="status"
          initialOptions={statusOptions}
          title="Selecione o status"
          disabled={isLoadingStatusEnum}
          isLoading={isLoadingStatusEnum}
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="size">Itens por página</Label>
        <Select
          hookForm={form}
          name="size"
          initialOptions={PAGE_SIZE}
          title="Itens por página"
        />
      </InputGroup>

      <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
        <Button type="button" buttonStyle="primary" onClick={handleClear}>
          Limpar
        </Button>
        <Button type="submit" buttonStyle="secondary">
          Filtrar
        </Button>
      </div>
    </form>
  );
}

export function BookingsSearchFilters({
  filters,
  onSearchChange,
  onFilterChange,
  onReset,
}: IProps) {
  const form = useForm<{ search: string }>({
    defaultValues: { search: String(filters.search ?? "") },
  });

  const watchedSearch = useWatch({ control: form.control, name: "search" });

  useEffect(() => {
    onSearchChange(watchedSearch ?? "");
  }, [watchedSearch, onSearchChange]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex w-full flex-row items-center gap-3 rounded-2xl border border-white/10 bg-primary/55 p-3 sm:flex-1">
        <Input
          {...form.register("search")}
          placeholder="Buscar agendamento por cliente ou ID"
          wrapperClassName="w-full"
        />
        <Filters
          filters={
            <AdvancedFiltersContent
              filters={filters}
              onFilterChange={onFilterChange}
              onReset={onReset}
            />
          }
          align="left"
        />
      </div>
    </div>
  );
}
