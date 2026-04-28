import { Button } from "@/src/components/button/button";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { Label } from "@/src/components/label/label";
import { useGameSystemById } from "@/src/features/game-systems/hooks/use-game-system-by-id";
import { useGameSystemsMutation } from "@/src/features/game-systems/hooks/use-game-systems-mutations";
import { type IGameSystem } from "@/src/features/game-systems/schemas/game-system.schema";
import { useBoundStore } from "@/src/store";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type IGameSystemForm = Partial<IGameSystem> & {
  name: string;
};

export const ModalEdit = ({ data }: { data?: IGameSystem }) => {
  const closeModal = useBoundStore((state) => state.closeModal);
  const { data: dataEdit, isLoading } = useGameSystemById(data?.id);
  const { createOrUpdate, isPending } = useGameSystemsMutation();

  const defaultValues = useMemo<IGameSystemForm>(
    () => ({
      name: "",
      description: "",
      ...(dataEdit ?? data),
    }),
    [data, dataEdit],
  );

  const form = useForm<IGameSystemForm>({
    defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit((values) => {
    const payload: IGameSystem = {
      ...defaultValues,
      ...values,
      id: dataEdit?.id ?? data?.id ?? values.id,
    };

    if (!payload.id) {
      delete (payload as { id?: number }).id;
    }

    createOrUpdate(payload);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="name" isRequired>
            Nome
          </Label>
          <ControlledInput
            hookForm={form}
            name="name"
            placeholder="Digite o nome do sistema"
            error={errors.name?.message}
            isLoading={isLoading}
          />
        </InputGroup>
      </FieldsWrapper>

      <InputGroup className="basis-full">
        <Label htmlFor="description">Descrição</Label>
        <ControlledInput
          hookForm={form}
          name="description"
          placeholder="Descrição do sistema de jogo"
          error={errors.description?.message}
          isLoading={isLoading}
        />
      </InputGroup>

      <div className="mt-6 flex justify-end gap-3">
        <Button buttonStyle="hollow" onClick={closeModal} type="button">
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isPending}
          disabled={!isDirty || isLoading || isPending}
        >
          {data?.id ? "Salvar alterações" : "Criar sistema"}
        </Button>
      </div>
    </form>
  );
};
