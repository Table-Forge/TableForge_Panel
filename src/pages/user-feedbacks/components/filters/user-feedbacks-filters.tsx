import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/src/components/button/button";
import { Filters } from "@/src/components/filters/filters";
import { useFilterContext } from "@/src/components/filters/filters.context";
import { Input } from "@/src/components/input/input.default";
import { InputGroup } from "@/src/components/input-group/input-group";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { PAGE_SIZE } from "@/src/constants/select-options";
import {
  UserFeedbackCategory,
  UserFeedbackStatus,
  UserFeedbackPlatform,
} from "@/src/features/user-feedbacks/enums";

import type { IUserFeedbackFilters } from "@/src/features/user-feedbacks/interfaces";

export type IUserFeedbackFilterState = IUserFeedbackFilters;

interface UserFeedbacksFiltersProps {
  filters: IUserFeedbackFilterState;
  setFilters: Dispatch<SetStateAction<IUserFeedbackFilterState>>;
}

const STATUS_OPTIONS: TSelectOptions[] = [
  { value: "", name: "Todos os Status" },
  { value: UserFeedbackStatus.New, name: "Novo" },
  { value: UserFeedbackStatus.InAnalysis, name: "Em Análise" },
  { value: UserFeedbackStatus.Planned, name: "Planejado" },
  { value: UserFeedbackStatus.Resolved, name: "Resolvido" },
  { value: UserFeedbackStatus.Declined, name: "Não Implementado" },
  { value: UserFeedbackStatus.Duplicated, name: "Duplicado" },
];

const CATEGORY_OPTIONS: TSelectOptions[] = [
  { value: "", name: "Todas as Categorias" },
  { value: UserFeedbackCategory.Suggestion, name: "Sugestão" },
  { value: UserFeedbackCategory.Bug, name: "Problema / Bug" },
  { value: UserFeedbackCategory.Experience, name: "Experiência" },
  { value: UserFeedbackCategory.Compliment, name: "Elogio" },
  { value: UserFeedbackCategory.Complaint, name: "Reclamação" },
  { value: UserFeedbackCategory.Question, name: "Dúvida" },
  { value: UserFeedbackCategory.Other, name: "Outro" },
];

const PLATFORM_OPTIONS: TSelectOptions[] = [
  { value: "", name: "Todas as Plataformas" },
  { value: UserFeedbackPlatform.Android, name: "Android" },
  { value: UserFeedbackPlatform.IOS, name: "iOS" },
  { value: UserFeedbackPlatform.Web, name: "Web" },
];

function AdvancedFiltersContent({ filters, setFilters }: UserFeedbacksFiltersProps) {
  const { close } = useFilterContext();

  const form = useForm<IUserFeedbackFilterState>({
    defaultValues: {
      status: filters.status ?? "",
      category: filters.category ?? "",
      platform: filters.platform ?? "",
      size: filters.size ?? 20,
    },
  });

  const handleApplyFilters = (data: IUserFeedbackFilterState) => {
    setFilters((prev) => ({
      ...prev,
      ...data,
      page: 1,
    }));
    close();
  };

  const handleClearFilters = () => {
    const cleared = {
      status: "",
      category: "",
      platform: "",
      size: 20,
    };
    form.reset(cleared);
    setFilters((prev) => ({
      ...prev,
      ...cleared,
      page: 1,
    }));
    close();
  };

  return (
    <form onSubmit={form.handleSubmit(handleApplyFilters)} className="space-y-4">
      <InputGroup>
        <Label htmlFor="status">Status</Label>
        <Select
          hookForm={form}
          name="status"
          initialOptions={STATUS_OPTIONS}
          title="Selecione o status"
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="category">Categoria</Label>
        <Select
          hookForm={form}
          name="category"
          initialOptions={CATEGORY_OPTIONS}
          title="Selecione a categoria"
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="platform">Plataforma</Label>
        <Select
          hookForm={form}
          name="platform"
          initialOptions={PLATFORM_OPTIONS}
          title="Selecione a plataforma"
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
        <Button type="button" buttonStyle="primary" onClick={handleClearFilters}>
          Limpar
        </Button>
        <Button type="submit" buttonStyle="secondary">
          Filtrar
        </Button>
      </div>
    </form>
  );
}

export function UserFeedbacksFilters({ filters, setFilters }: UserFeedbacksFiltersProps) {
  const form = useForm<{ search: string }>({
    defaultValues: { search: filters.search ?? "" },
  });

  const watchedSearch = form.watch("search");

  useEffect(() => {
    setFilters((prev) => {
      if (prev.search === watchedSearch) return prev;
      return { ...prev, search: watchedSearch, page: 1 };
    });
  }, [watchedSearch, setFilters]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="w-full flex flex-row gap-3 items-center rounded-2xl border border-white/10 bg-primary/55 p-3 sm:flex-1">
        <Input
          {...form.register("search")}
          placeholder="Buscar por título ou descrição..."
          wrapperClassName="w-full"
        />
        <Filters
          filters={<AdvancedFiltersContent filters={filters} setFilters={setFilters} />}
          align="left"
        />
      </div>
    </div>
  );
}
