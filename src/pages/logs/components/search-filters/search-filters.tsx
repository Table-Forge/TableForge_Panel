import {
  Button,
  DateInput,
  Filters,
  Input,
  InputGroup,
  Label,
  Select,
} from "@/src/components";
import { useFilterContext } from "@/src/components/filters/filters.context";
import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { PAGE_SIZE } from "@/src/constants/select-options";
import { useLogEnums } from "@/src/features/logs/hooks/use-log-enums";
import {
  INITIAL_LOGS_FILTERS,
  LOGS_PAGE_SIZE,
} from "@/src/features/logs/hooks/use-logs";
import type { IGetPaginatedParams } from "@/src/interfaces";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

interface ILogsSearchFiltersProps {
  filters: IGetPaginatedParams;
  setFilters: (newFilters: IGetPaginatedParams) => void;
  resetFilters: () => void;
}

function AdvancedFiltersContent({
  filters,
  setFilters,
  resetFilters,
}: ILogsSearchFiltersProps) {
  const { close } = useFilterContext();
  const { logTypeEnum, isLoadingLogTypeEnum } = useLogEnums();

  const form = useForm<IGetPaginatedParams>({
    defaultValues: {
      logType: filters.logType ?? "",
      startDate: filters.startDate ?? "",
      endDate: filters.endDate ?? "",
      size: filters.size ?? LOGS_PAGE_SIZE,
    },
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  const logTypeOptions = useMemo<TSelectOptions[]>(
    () => [{ value: "", name: "Todos os tipos" }, ...logTypeEnum],
    [logTypeEnum],
  );

  useEffect(() => {
    form.reset({
      logType: filters.logType ?? "",
      startDate: filters.startDate ?? "",
      endDate: filters.endDate ?? "",
      size: filters.size ?? LOGS_PAGE_SIZE,
    });
  }, [filters.endDate, filters.logType, filters.size, filters.startDate, form]);

  const onApplyFilters = form.handleSubmit((values) => {
    setFilters({
      ...filters,
      page: 1,
      logType: values.logType ?? "",
      startDate: values.startDate ?? "",
      endDate: values.endDate ?? "",
      size: Number(values.size ?? filters.size ?? LOGS_PAGE_SIZE),
    });
    close();
  });

  const onClearFilters = () => {
    resetFilters();
    form.reset(INITIAL_LOGS_FILTERS);
    close();
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
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

export function LogsSearchFilters({
  filters,
  setFilters,
  resetFilters,
}: ILogsSearchFiltersProps) {
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
          placeholder="Buscar por código, endpoint, tipo ou mensagem"
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
