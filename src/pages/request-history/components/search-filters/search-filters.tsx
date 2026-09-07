import { Button } from "@/src/components/button/button";
import { CheckboxControlled } from "@/src/components/checkbox/checkbox-controlled";
import { Filters } from "@/src/components/filters/filters";
import { Input } from "@/src/components/input/input.default";
import { DateInput } from "@/src/components/input/input.date.controlled";
import { InputGroup } from "@/src/components/input-group/input-group";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import { useFilterContext } from "@/src/components/filters/filters.context";
import { INITIAL_PAGINATE } from "@/src/constants/paginate";
import { PAGE_SIZE } from "@/src/constants/select-options";
import {
  INITIAL_REQUEST_HISTORY_FILTERS,
  REQUEST_HISTORY_COMPONENT_FILTER_KEY,
  useAllRequestHistory,
} from "@/src/features/request-history/hooks/use-all-request-history";
import type { IGetRequestHistory } from "@/src/features/request-history/hooks/types";
import { useComponentStore } from "@/src/store";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const MIN_TOTAL_MS_SHORTCUTS = [500, 1000, 3000];

function AdvancedFiltersContent({ filters }: { filters: IGetRequestHistory }) {
  const { close } = useFilterContext();
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);

  const defaultValues: IGetRequestHistory = {
    ...filters,
    startDate: filters.startDate ?? "",
    endDate: filters.endDate ?? "",
    userId: filters.userId ?? "",
    statusCode: filters.statusCode ?? "",
    minTotalMs: filters.minTotalMs ?? "",
    onlyWithDetails: filters.onlyWithDetails ?? false,
    size:
      filters.size ??
      INITIAL_REQUEST_HISTORY_FILTERS.size ??
      INITIAL_PAGINATE.size,
    page: filters.page ?? INITIAL_PAGINATE.page,
  };

  const form = useForm<IGetRequestHistory>({
    defaultValues: defaultValues,
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  useEffect(() => {
    form.reset(defaultValues);
  }, [
    filters.page,
    filters.search,
    filters.startDate,
    filters.endDate,
    filters.userId,
    filters.statusCode,
    filters.minTotalMs,
    filters.onlyWithDetails,
    filters.size,
    form,
  ]);

  const handleApplyFilters = (data: IGetRequestHistory) => {
    setFiltersGlobal(REQUEST_HISTORY_COMPONENT_FILTER_KEY, {
      ...filters,
      ...data,
      page: 1,
    });
    close();
  };

  const clearSearch = () => {
    resetFiltersGlobal(
      REQUEST_HISTORY_COMPONENT_FILTER_KEY,
      INITIAL_REQUEST_HISTORY_FILTERS,
    );
    form.reset(INITIAL_REQUEST_HISTORY_FILTERS);
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
          <Label htmlFor="statusCode">Status HTTP</Label>
          <Input
            {...form.register("statusCode")}
            type="number"
            placeholder="Ex.: 404"
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="userId">Usuário (ID)</Label>
          <Input
            {...form.register("userId")}
            type="number"
            placeholder="Ex.: 5"
          />
        </InputGroup>
      </div>

      <InputGroup>
        <Label htmlFor="minTotalMs">Tempo mínimo (ms)</Label>
        <Input
          {...form.register("minTotalMs")}
          type="number"
          placeholder="Ex.: 1000"
        />
        <div className="flex gap-2 pt-1">
          {MIN_TOTAL_MS_SHORTCUTS.map((shortcut) => (
            <button
              key={shortcut}
              type="button"
              onClick={() =>
                form.setValue("minTotalMs", shortcut, { shouldDirty: true })
              }
              className="rounded-lg border border-white/10 px-2 py-1 text-xs font-bold text-grays-100 transition-all hover:border-white/25 hover:text-white"
            >
              {shortcut} ms
            </button>
          ))}
        </div>
      </InputGroup>

      <div className="grid gap-3 md:grid-cols-2 md:items-end">
        <InputGroup>
          <CheckboxControlled
            hookForm={form}
            name="onlyWithDetails"
            label="Somente com diagnóstico"
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

export function RequestHistorySearchFilters() {
  const { filters, onSearchChange } = useAllRequestHistory();

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
          placeholder="Buscar por rota ou caminho"
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
