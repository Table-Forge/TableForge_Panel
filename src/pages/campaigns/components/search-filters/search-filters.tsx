import { Button } from "@/src/components/button/button";
import { Filters } from "@/src/components/filters/filters";
import { Input } from "@/src/components/input/input.default";
import { InputGroup } from "@/src/components/input-group/input-group";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import { useFilterContext } from "@/src/components/filters/filters.context";
import { PAGE_SIZE } from "@/src/constants/select-options";
import { INITIAL_CAMPAIGNS_FILTERS } from "@/src/features/campaigns/hooks/use-all-campaigns";
import type { IGetPaginatedParams } from "@/src/interfaces";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface ICampaignsSearchFiltersProps {
  filters: IGetPaginatedParams;
  setFilters: (newFilters: IGetPaginatedParams) => void;
  resetFilters: () => void;
}

function AdvancedFiltersContent({
  filters,
  setFilters,
  resetFilters,
}: ICampaignsSearchFiltersProps) {
  const { close } = useFilterContext();

  const defaultValues = {
    size: filters.size ?? INITIAL_CAMPAIGNS_FILTERS.size,
  };

  const form = useForm<IGetPaginatedParams>({
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [filters.size, form]);

  const onApplyFilters = form.handleSubmit((values) => {
    setFilters({
      ...filters,
      ...values,
      page: 1,
    });
    close();
  });

  const onClearFilters = () => {
    resetFilters();
    form.reset(INITIAL_CAMPAIGNS_FILTERS);
    close();
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
      className="space-y-4"
    >
      <InputGroup>
        <Label htmlFor="size">Itens por página</Label>
        <Select
          initialOptions={PAGE_SIZE}
          title="Itens por página"
          name="size"
          hookForm={form}
        />
      </InputGroup>

      <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
        <Button type="button" buttonStyle="primary" onClick={onClearFilters}>
          Limpar
        </Button>
        <Button type="button" buttonStyle="secondary" onClick={onApplyFilters}>
          Filtrar
        </Button>
      </div>
    </form>
  );
}

export function CampaignsSearchFilters({
  filters,
  setFilters,
  resetFilters,
}: ICampaignsSearchFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="w-full flex flex-row gap-3 items-center rounded-2xl border border-white/10 bg-primary/55 p-3 sm:flex-1">
        <Input
          value={String(filters.search ?? "")}
          onChange={(event) => {
            setFilters({
              ...filters,
              page: 1,
              search: event.target.value,
            });
          }}
          placeholder="Buscar campanha por título, sistema, mestre ou local"
          wrapperClassName="w-full"
        />
        <Filters
          filters={
            <AdvancedFiltersContent
              filters={filters}
              setFilters={setFilters}
              resetFilters={resetFilters}
            />
          }
          align="right"
        />
      </div>
    </div>
  );
}



