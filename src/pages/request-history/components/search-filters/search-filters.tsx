import { Button } from "@/src/components/button/button";
import { CheckboxControlled } from "@/src/components/checkbox/checkbox-controlled";
import { Filters } from "@/src/components/filters/filters";
import { Input } from "@/src/components/input/input.default";
import { ControlledNumberInput } from "@/src/components/input/input.number.controlled";
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
import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { useUsersSelect } from "@/src/features/users/hooks/use-users-select";
import { useComponentStore } from "@/src/store";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

const MIN_TOTAL_MS_SHORTCUTS = [500, 1000, 3000];

function AdvancedFiltersContent({ filters }: { filters: IGetRequestHistory }) {
  const { close } = useFilterContext();
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);
  const { userOptions, isLoadingUsersSelect, onSearchUsers } = useUsersSelect();

  const userSelectOptions = useMemo<TSelectOptions[]>(
    () => [{ value: "", name: "Todos os usuários" }, ...userOptions],
    [userOptions],
  );

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
          <ControlledNumberInput
            hookForm={form}
            name="statusCode"
            format="integer"
            allowEmpty
            inputMode="numeric"
            placeholder="Ex.: 404"
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="userId">Usuário</Label>
          <Select
            hookForm={form}
            name="userId"
            initialOptions={userSelectOptions}
            title="Todos os usuários"
            searchInput
            searchPlaceholder="Buscar usuário"
            onChangeInputSearch={onSearchUsers}
            isLoading={isLoadingUsersSelect}
          />
        </InputGroup>
      </div>

      <InputGroup>
        <Label htmlFor="minTotalMs">Tempo mínimo (ms)</Label>
        <ControlledNumberInput
          hookForm={form}
          name="minTotalMs"
          format="integer"
          allowEmpty
          inputMode="numeric"
          placeholder="Ex.: 1000"
        />
        <div className="flex gap-2 pt-1">
          {MIN_TOTAL_MS_SHORTCUTS.map((shortcut) => (
            <Button
              key={shortcut}
              type="button"
              buttonStyle="soft"
              size="xs"
              onClick={() =>
                form.setValue("minTotalMs", shortcut, { shouldDirty: true })
              }
            >
              {shortcut} ms
            </Button>
          ))}
        </div>
      </InputGroup>

      <div className="grid gap-3 md:grid-cols-2 md:items-end">
        <div className="flex h-12 items-center">
          <CheckboxControlled
            hookForm={form}
            name="onlyWithDetails"
            label="Somente com diagnóstico"
          />
        </div>

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
      <div className="w-full flex flex-row gap-3 items-center rounded-xl border border-white/10 bg-primary/55 p-3 sm:flex-1">
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
