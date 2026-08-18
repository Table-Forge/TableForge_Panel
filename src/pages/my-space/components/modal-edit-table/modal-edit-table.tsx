import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { Button } from "@/src/components/button/button";
import { ModalFooter } from "@/src/components/modals/modal-footer";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import {
  type ISpaceTable,
  type ISpaceTableCreate,
  SpaceTableCreateSchema,
} from "@/src/features/spaces/schemas/spaces.schema";
import { useSpaceTableMutations } from "@/src/features/spaces/hooks/use-spaces-mutations";
import { useBoundStore } from "@/src/store";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTableShapeEnum } from "@/src/features/spaces/hooks/enums/use-spaces-enums";

interface IProps {
  spaceId: number;
  data?: ISpaceTable;
}

export const ModalEditTable = ({ spaceId, data }: IProps) => {
  const closeModal = useBoundStore((state) => state.closeModal);
  const { shapeEnum, isLoadingShapeEnum } = useTableShapeEnum();

  const { createTableMutation, updateTableMutation } = useSpaceTableMutations();

  const isPending = createTableMutation.isPending || updateTableMutation.isPending;

  const defaultValues = useMemo<ISpaceTableCreate>(
    () => ({
      name: data?.name ?? "",
      description: data?.description ?? "",
      shape: data?.shape ?? "",
      seatCount: data?.seatCount ?? 4,
      supportedGames: data?.supportedGames ?? "",
      hourlyRate: data?.hourlyRate ?? 0,
      isActive: data?.isActive ?? true,
    }),
    [data]
  );

  const form = useForm<ISpaceTableCreate>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(SpaceTableCreateSchema) as Resolver<ISpaceTableCreate>,
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit((formData) => {
    const payload: ISpaceTableCreate = {
      ...formData,
      seatCount: Number(formData.seatCount),
      hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
    };

    if (data?.id) {
      updateTableMutation.mutate(
        { id: data.id, data: payload },
        {
          onSuccess: () => closeModal(),
        }
      );
    } else {
      createTableMutation.mutate(
        { spaceId, data: payload },
        {
          onSuccess: () => closeModal(),
        }
      );
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="name" isRequired>
            Nome / Número da Mesa
          </Label>
          <ControlledInput
            hookForm={form}
            name="name"
            placeholder="Mesa 1, Mesa Redonda, etc"
            error={errors.name?.message}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="shape" isRequired>
            Formato
          </Label>
          <Select
            hookForm={form}
            name="shape"
            initialOptions={shapeEnum}
            title="Selecione o formato"
            error={errors.shape?.message}
            searchInput={false}
            disabled={isLoadingShapeEnum || isPending}
            isLoading={isLoadingShapeEnum}
          />
        </InputGroup>
      </FieldsWrapper>

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="seatCount" isRequired>
            Assentos
          </Label>
          <ControlledInput
            hookForm={form}
            name="seatCount"
            type="number"
            placeholder="4"
            error={errors.seatCount?.message}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="hourlyRate">Preço por Hora (R$)</Label>
          <ControlledInput
            hookForm={form}
            name="hourlyRate"
            type="number"
            placeholder="0"
            error={errors.hourlyRate?.message}
          />
          <span className="text-xs text-grays-100">
            Deixe em branco ou 0 para mesa gratuita
          </span>
        </InputGroup>
      </FieldsWrapper>

      <InputGroup>
        <Label htmlFor="supportedGames">Jogos Suportados</Label>
        <ControlledInput
          hookForm={form}
          name="supportedGames"
          placeholder="Ex: RPG, Tabuleiro, Magic"
          error={errors.supportedGames?.message}
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="description">Descrição Adicional</Label>
        <ControlledInput
          hookForm={form}
          name="description"
          placeholder="Informações extras da mesa"
          error={errors.description?.message}
        />
      </InputGroup>

      <ModalFooter>
        <Button buttonStyle="hollow" onClick={closeModal} type="button">
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isPending}
          disabled={!isDirty || isPending}
        >
          {data?.id ? "Salvar alterações" : "Adicionar Mesa"}
        </Button>
      </ModalFooter>
    </form>
  );
};
