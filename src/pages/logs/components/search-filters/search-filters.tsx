import { Button } from "@/src/components/button/button";
import { Filters } from "@/src/components/filters/filters";
import { Input } from "@/src/components/input/input.default";
import { DateInput } from "@/src/components/input/input.date.controlled";
import { InputGroup } from "@/src/components/input-group/input-group";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import { useFilterContext } from "@/src/components/filters/filters.context";
import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { INITIAL_PAGINATE } from "@/src/constants/paginate";
import { PAGE_SIZE } from "@/src/constants/select-options";
import {
  INITIAL_LOGS_FILTERS,
  LOGS_COMPONENT_FILTER_KEY,
  useAllLogs,
} from "@/src/features/logs/hooks/use-all-logs";
import { useLogTypeEnum } from "@/src/features/logs/hooks/enums/use-log-type-enum";
import type { IGetPaginatedParams } from "@/src/interfaces";
import { useComponentStore } from "@/src/store";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

function AdvancedFiltersContent({ filters }: { filters: IGetPaginatedParams }) {
  const { close } = useFilterContext();
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);
  const { logTypeEnum, isLoadingLogTypeEnum } = useLogTypeEnum();

  const defaultValues: IGetPaginatedParams = {
    ...filters,
    logType: filters.logType ?? "",
    startDate: filters.startDate ?? "",
    endDate: filters.endDate ?? "",
    size: filters.size ?? INITIAL_LOGS_FILTERS.size ?? INITIAL_PAGINATE.size,
    page: filters.page ?? INITIAL_PAGINATE.page,
  };

  const form = useForm<IGetPaginatedParams>({
    defaultValues: defaultValues,
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  const logTypeOptions = useMemo<TSelectOptions[]>(
    () => [{ value: "", name: "Todos os tipos" }, ...logTypeEnum],
    [logTypeEnum],
  );

  useEffect(() => {
    form.reset(defaultValues);
  }, [
    filters.page,
    filters.search,
    filters.logType,
    filters.startDate,
    filters.endDate,
    filters.size,
    form,
  ]);

  const handleApplyFilters = (data: IGetPaginatedParams) => {
    setFiltersGlobal(LOGS_COMPONENT_FILTER_KEY, {
      ...filters,
      ...data,
      page: 1,
    });
    close();
  };

  const clearSearch = () => {
    resetFiltersGlobal(LOGS_COMPONENT_FILTER_KEY, INITIAL_LOGS_FILTERS);
    form.reset(INITIAL_LOGS_FILTERS);
    close();
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleApplyFilters)}
      className="space-y-4"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <InputGroup>
          <Label htmlFor="startDate">Data inicial</Label>
          <DateInput
            hookForm={form}
            name="startDate"
            maxDate={endDate || undefined}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="endDate">Data final</Label>
          <DateInput
            hookForm={form}
            name="endDate"
            minDate={startDate || undefined}
          />
        </InputGroup>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <InputGroup>
          <Label htmlFor="logType">Tipo de log</Label>
          <Select
            initialOptions={logTypeOptions}
            title="Tipo de log"
            name="logType"
            hookForm={form}
            isLoading={isLoadingLogTypeEnum}
            searchInput
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="size">Itens por página</Label>
          <Select
            initialOptions={PAGE_SIZE}
            title="Itens por página"
            name="size"
            hookForm={form}
          />
        </InputGroup>
      </div>

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

export function LogsSearchFilters() {
  const { filters, onSearchChange } = useAllLogs();

  const form = useForm<{ search: string }>({
    defaultValues: { search: String(filters.search ?? "") },
  });

  const watchedSearch = form.watch("search");

  useEffect(() => {
    onSearchChange(watchedSearch);
  }, [watchedSearch, onSearchChange]);

  useEffect(() => {
    const next = String(filters.search ?? "");
    if (next !== form.getValues("search")) {
      form.setValue("search", next);
    }
  }, [filters.search, form]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="w-full flex flex-row gap-3 items-center rounded-2xl border border-white/10 bg-primary/55 p-3 sm:flex-1">
        <Input
          {...form.register("search")}
          placeholder="Buscar por código, endpoint, tipo ou mensagem"
          wrapperClassName="w-full"
        />
        <Filters
          filters={<AdvancedFiltersContent filters={filters} />}
          align="left"
        />
      </div>
    </div>
  );
}
