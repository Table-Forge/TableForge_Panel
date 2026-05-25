import { Button } from "@/src/components/button/button";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { ControlledTextarea } from "@/src/components/input/input.textarea.controlled";
import { Label } from "@/src/components/label/label";
import { useRaceById } from "@/src/features/races/hooks/use-race-by-id";
import { useRacesMutation } from "@/src/features/races/hooks/use-races-mutations";
import type { IRace } from "@/src/features/races/schemas/race.schema";
import { useBoundStore } from "@/src/store";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type IRaceForm = Partial<IRace> & {
  name: string;
};

export const ModalEdit = ({ data }: { data?: IRace }) => {
  const closeModal = useBoundStore((state) => state.closeModal);
  const { data: dataEdit, isLoading } = useRaceById(data?.id);
  const { createOrUpdate, isPending } = useRacesMutation();

  const defaultValues = useMemo<IRaceForm>(
    () => ({
      name: "",
      description: "",
      ...(dataEdit ?? data),
    }),
    [data, dataEdit],
  );

  const form = useForm<IRaceForm>({
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
    const payload: IRace = {
      ...defaultValues,
      ...values,
      id: dataEdit?.id ?? data?.id ?? values.id,
    };

    delete (payload as IRace & { createdAt?: Date }).createdAt;
    delete (payload as IRace & { updatedAt?: Date }).updatedAt;

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
            placeholder="Digite o nome da raça"
            error={errors.name?.message}
            isLoading={isLoading}
          />
        </InputGroup>
      </FieldsWrapper>

      <InputGroup className="basis-full">
        <Label htmlFor="description">Descrição</Label>
        <ControlledTextarea
          hookForm={form}
          name="description"
          placeholder="Descrição da raça"
          error={errors.description?.message}
          isLoading={isLoading}
          maxLength={500}
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
          {data?.id ? "Salvar alterações" : "Criar raça"}
        </Button>
      </div>
    </form>
  );
};
