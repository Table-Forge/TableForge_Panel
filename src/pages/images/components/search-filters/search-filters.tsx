import { Button } from "@/src/components/button/button";
import { Filters } from "@/src/components/filters/filters";
import { Input } from "@/src/components/input/input.default";
import { InputGroup } from "@/src/components/input-group/input-group";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import { useFilterContext } from "@/src/components/filters/filters.context";
import { EMPTY_OPTION, PAGE_SIZE } from "@/src/constants/select-options";
import { useImageTypeEnum } from "@/src/features/images/hooks/enums/use-image-type-enum";
import {
  IMAGES_COMPONENT_FILTER_KEY,
  INITIAL_IMAGES_FILTERS,
  useAllImages,
} from "@/src/features/images/hooks/use-all-images";
import type { IGetPaginatedParams } from "@/src/interfaces";
import { useComponentStore } from "@/src/store";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

function AdvancedFiltersContent({ filters }: { filters: IGetPaginatedParams }) {
  const { close } = useFilterContext();
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);
  const resetFiltersGlobal = useComponentStore((state) => state.resetFilters);
  const { imageTypeEnum, isLoadingImageTypeEnum } = useImageTypeEnum();

  const defaultValues: IGetPaginatedParams = {
    ...filters,
    size: filters.size ?? INITIAL_IMAGES_FILTERS.size,
    type: filters.type ?? "",
  };

  const form = useForm<IGetPaginatedParams>({
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [filters.size, form]);

  const handleApplyFilters = (data: IGetPaginatedParams) => {
    setFiltersGlobal(IMAGES_COMPONENT_FILTER_KEY, {
      ...filters,
      ...data,
      page: 1,
    });
    close();
  };

  const clearSearch = () => {
    resetFiltersGlobal(IMAGES_COMPONENT_FILTER_KEY, INITIAL_IMAGES_FILTERS);
    form.reset(INITIAL_IMAGES_FILTERS);
    close();
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleApplyFilters)}
      className="space-y-4"
    >
      <InputGroup>
        <Label htmlFor="type">Tipo</Label>
        <Select
          initialOptions={[EMPTY_OPTION, ...(imageTypeEnum || [])]}
          title="Todos"
          name="type"
          hookForm={form}
          isLoading={isLoadingImageTypeEnum}
          disabled={isLoadingImageTypeEnum}
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

export function ImagesSearchFilters() {
  const { filters, onSearchChange } = useAllImages();

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
          placeholder="Buscar imagem por nome ou tipo"
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
