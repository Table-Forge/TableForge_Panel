import { Button } from "@/src/components/button/button";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { Select } from "@/src/components/select/select";
import { type TSelectOptions } from "@/src/components/select/select.interfaces";
import { useBookingStatusEnum } from "@/src/features/spaces/hooks/enums/use-spaces-enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { MdFilterList } from "react-icons/md";
import { z } from "zod";

interface IProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
}

const filterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
});

type IFilterForm = z.infer<typeof filterSchema>;

export function SearchFilters({ onSearchChange, onStatusChange }: IProps) {
  const { statusEnum, isLoadingStatusEnum } = useBookingStatusEnum();

  const statusOptions = useMemo<TSelectOptions[]>(
    () => [
      { id: "all", value: "", name: "Todos os Status", allowSelect: true },
      ...statusEnum,
    ],
    [statusEnum]
  );

  const form = useForm<IFilterForm>({
    defaultValues: {
      search: "",
      status: "",
    },
    resolver: zodResolver(filterSchema),
  });

  const { reset } = form;

  // React Compiler compatibility fix: Do not use form.watch outside components or inline.
  // We'll use handleSubmit for search, or an isolated useEffect if we have to.
  // Actually, standard is to have a button or just use onBlur/onChange. Let's make it a form submission to trigger the filters.

  const onSubmit = form.handleSubmit((data) => {
    onSearchChange(data.search ?? "");
    onStatusChange(data.status ?? "");
  });

  const handleClear = () => {
    reset();
    onSearchChange("");
    onStatusChange("");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-lg bg-secondary p-4 md:flex-row md:items-end"
    >
      <div className="flex-1">
        <label className="mb-2 block text-sm font-medium text-white">
          Buscar
        </label>
        <ControlledInput
          hookForm={form}
          name="search"
          placeholder="Buscar por cliente ou ID"
          className="bg-primary/50"
        />
      </div>
      <div className="w-full md:w-64">
        <label className="mb-2 block text-sm font-medium text-white">
          Status
        </label>
        <Select
          hookForm={form}
          name="status"
          initialOptions={statusOptions}
          title="Selecione o status"
          disabled={isLoadingStatusEnum}
          isLoading={isLoadingStatusEnum}
          className="bg-primary/50"
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" buttonStyle="hollow" onClick={handleClear}>
          Limpar
        </Button>
        <Button type="submit" buttonStyle="primary">
          <MdFilterList />
          Filtrar
        </Button>
      </div>
    </form>
  );
}
