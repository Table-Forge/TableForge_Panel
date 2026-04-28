import { Button } from "@/src/components/button/button";
import { Filters } from "@/src/components/filters/filters";
import { useFilterContext } from "@/src/components/filters/filters.context";
import { InputGroup } from "@/src/components/input-group/input-group";
import { Input } from "@/src/components/input/input.default";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import { PAGE_SIZE } from "@/src/constants/select-options";
import {
  GAME_SYSTEMS_COMPONENT_FILTER_KEY,
  INITIAL_GAME_SYSTEMS_FILTERS,
} from "@/src/features/game-systems/hooks/use-all-game-systems";
import type { IGetPaginatedParams } from "@/src/interfaces";
import { useComponentStore } from "@/src/store";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

function AdvancedFiltersContent({
  filters,
}: {
  filters: IGetPaginatedParams;
}) {
  const { close } = useFilterContext();
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);

  const defaultValues: IGetPaginatedParams = {
    ...filters,
    size: filters.size ?? INITIAL_GAME_SYSTEMS_FILTERS.size,
  };

  const form = useForm<IGetPaginatedParams>({
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [filters.size, form]);

  const handleApplyFilters = (data: IGetPaginatedParams) => {
    setFiltersGlobal(GAME_SYSTEMS_COMPONENT_FILTER_KEY, {
      ...filters,
      ...data,
      page: 1,
    });
    close();
  };

  const clearSearch = () => {
    resetFiltersGlobal(
      GAME_SYSTEMS_COMPONENT_FILTER_KEY,
      INITIAL_GAME_SYSTEMS_FILTERS,
    );
    form.reset(INITIAL_GAME_SYSTEMS_FILTERS);
    close();
  };

  return (
    <form onSubmit={form.handleSubmit(handleApplyFilters)} className="space-y-4">
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
        <Button type="button" buttonStyle="primary" onClick={clearSearch}>
          Limpar
        </Button>
        <Button type="submit" buttonStyle="secondary">
          Filtrar
        </Button>
      </div>
    </form>
  );
}

export function GameSystemsSearchFilters() {
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const filters = useComponentStore(
    (state) =>
      (state.states[GAME_SYSTEMS_COMPONENT_FILTER_KEY]?.filters as
        | IGetPaginatedParams
        | undefined) ?? INITIAL_GAME_SYSTEMS_FILTERS,
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="w-full flex flex-row gap-3 items-center rounded-2xl border border-white/10 bg-primary/55 p-3 sm:flex-1">
        <Input
          value={String(filters.search ?? "")}
          onChange={(event) => {
            setFiltersGlobal(GAME_SYSTEMS_COMPONENT_FILTER_KEY, {
              ...filters,
              page: 1,
              search: event.target.value,
            });
          }}
          placeholder="Buscar sistema de jogo por nome"
          wrapperClassName="w-full"
        />
        <Filters
          filters={<AdvancedFiltersContent filters={filters} />}
          align="right"
        />
      </div>
    </div>
  );
}
