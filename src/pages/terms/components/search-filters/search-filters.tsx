import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/src/components/button/button";
import { Filters } from "@/src/components/filters/filters";
import { Input } from "@/src/components/input/input.default";
import { InputGroup } from "@/src/components/input-group/input-group";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import { useFilterContext } from "@/src/components/filters/filters.context";
import { PAGE_SIZE } from "@/src/constants/select-options";
import {
  INITIAL_TERMS_FILTERS,
  TERMS_COMPONENT_FILTER_KEY,
  useAllTerms,
} from "@/src/features/terms/hooks/use-all-terms";
import {
  useTermsAudienceEnum,
  useTermsStatusEnum,
} from "@/src/features/terms/hooks/enums/use-terms-enums";
import type { IGetTermsParams } from "@/src/features/terms/services/terms.services";
import { useComponentStore } from "@/src/store";

function AdvancedFiltersContent({ filters }: { filters: IGetTermsParams }) {
  const { close } = useFilterContext();
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);

  const { data: audienceOptions } = useTermsAudienceEnum(false);
  const { data: statusOptions } = useTermsStatusEnum(false);

  const defaultValues: IGetTermsParams = {
    ...filters,
    size: filters.size ?? INITIAL_TERMS_FILTERS.size,
    audience: filters.audience ?? "",
    status: filters.status ?? "",
  };

  const form = useForm<IGetTermsParams>({
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [filters.size, filters.audience, filters.status, form]);

  const handleApplyFilters = (data: IGetTermsParams) => {
    setFiltersGlobal(TERMS_COMPONENT_FILTER_KEY, {
      ...filters,
      ...data,
      page: 1,
    });
    close();
  };

  const clearSearch = () => {
    resetFiltersGlobal(TERMS_COMPONENT_FILTER_KEY, INITIAL_TERMS_FILTERS);
    form.reset(INITIAL_TERMS_FILTERS);
    close();
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleApplyFilters)}
      className="space-y-4"
    >
      <InputGroup>
        <Label htmlFor="audience">Público</Label>
        <Select
          initialOptions={audienceOptions ?? []}
          title="Todos os públicos"
          name="audience"
          hookForm={form}
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="status">Situação</Label>
        <Select
          initialOptions={statusOptions ?? []}
          title="Todas as situações"
          name="status"
          hookForm={form}
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

export function TermsSearchFilters() {
  const { filters, onSearchChange } = useAllTerms();

  const form = useForm<{ search: string }>({
    defaultValues: { search: String(filters.search ?? "") },
  });

  const watchedSearch = useWatch({ control: form.control, name: "search" });

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
      <div className="w-full flex flex-row gap-3 items-center chamfer-md border border-white/10 bg-card p-3 sm:flex-1">
        <Input
          {...form.register("search")}
          placeholder="Buscar contrato por título"
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
