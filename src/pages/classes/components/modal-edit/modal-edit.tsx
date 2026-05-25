import { Button } from "@/src/components/button/button";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { ControlledTextarea } from "@/src/components/input/input.textarea.controlled";
import { Label } from "@/src/components/label/label";
import { useClassById } from "@/src/features/classes/hooks/use-class-by-id";
import { useClassesMutation } from "@/src/features/classes/hooks/use-classes-mutations";
import type { IClass } from "@/src/features/classes/schemas/class.schema";
import { useBoundStore } from "@/src/store";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type IClassForm = Partial<IClass> & {
  name: string;
};

export const ModalEdit = ({ data }: { data?: IClass }) => {
  const closeModal = useBoundStore((state) => state.closeModal);
  const { data: dataEdit, isLoading } = useClassById(data?.id);
  const { createOrUpdate, isPending } = useClassesMutation();

  const defaultValues = useMemo<IClassForm>(
    () => ({
      name: "",
      description: "",
      ...(dataEdit ?? data),
    }),
    [data, dataEdit],
  );

  const form = useForm<IClassForm>({
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
    const payload: IClass = {
      ...defaultValues,
      ...values,
      id: dataEdit?.id ?? data?.id ?? values.id,
    };

    delete (payload as IClass & { createdAt?: Date }).createdAt;
    delete (payload as IClass & { updatedAt?: Date }).updatedAt;

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
            placeholder="Digite o nome da classe"
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
          placeholder="Descrição da classe"
          error={errors.description?.message}
          isLoading={isLoading}
          maxLength={200}
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
          {data?.id ? "Salvar alterações" : "Criar classe"}
        </Button>
      </div>
    </form>
  );
};
