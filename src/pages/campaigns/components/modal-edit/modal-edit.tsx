import {
  Button,
  ControlledInput,
  FieldsWrapper,
  InputGroup,
  Label,
} from "@/src/components";
import { useCampaignById } from "@/src/features/campaigns/hooks/use-campaign-by-id";
import { useCampaignsMutation } from "@/src/features/campaigns/hooks/use-campaigns-mutations";
import { type ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { useBoundStore } from "@/src/store";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type ICampaignForm = Partial<ICampaign> & {
  title: string;
  system: string;
  gameMaster: string;
  location: string;
  currentPartySize: number;
  maxPartySize: number;
};

export const ModalEdit = ({ data }: { data?: ICampaign }) => {
  const closeModal = useBoundStore((state) => state.closeModal);
  const { data: dataEdit, isLoading } = useCampaignById(data?.id);
  const { createOrUpdate, isPending } = useCampaignsMutation();

  const defaultValues = useMemo<ICampaignForm>(
    () => ({
      title: "",
      system: "",
      gameMaster: "",
      location: "",
      currentPartySize: 0,
      maxPartySize: 1,
      ...(dataEdit ?? data),
    }),
    [data, dataEdit],
  );

  const form = useForm<ICampaignForm>({
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
    const payload: ICampaign = {
      ...defaultValues,
      ...values,
      currentPartySize: Number(values.currentPartySize ?? 0),
      maxPartySize: Number(values.maxPartySize ?? 0),
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
          <Label htmlFor="title" isRequired>
            Título
          </Label>
          <ControlledInput
            hookForm={form}
            name="title"
            placeholder="Digite o título da campanha"
            error={errors.title?.message}
            isLoading={isLoading}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="system" isRequired>
            Sistema
          </Label>
          <ControlledInput
            hookForm={form}
            name="system"
            placeholder="Ex: D&D 5e"
            error={errors.system?.message}
            isLoading={isLoading}
          />
        </InputGroup>
      </FieldsWrapper>

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="gameMaster" isRequired>
            Mestre
          </Label>
          <ControlledInput
            hookForm={form}
            name="gameMaster"
            placeholder="Nome do mestre"
            error={errors.gameMaster?.message}
            isLoading={isLoading}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="location" isRequired>
            Local
          </Label>
          <ControlledInput
            hookForm={form}
            name="location"
            placeholder="Presencial ou Online"
            error={errors.location?.message}
            isLoading={isLoading}
          />
        </InputGroup>
      </FieldsWrapper>

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="currentPartySize" isRequired>
            Jogadores atuais
          </Label>
          <ControlledInput
            hookForm={form}
            name="currentPartySize"
            type="number"
            min={0}
            step={1}
            placeholder="0"
            disabled={isLoading || isPending}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="maxPartySize" isRequired>
            Máximo de jogadores
          </Label>
          <ControlledInput
            hookForm={form}
            name="maxPartySize"
            type="number"
            min={1}
            step={1}
            placeholder="1"
            disabled={isLoading || isPending}
          />
        </InputGroup>
      </FieldsWrapper>

      <InputGroup className="basis-full">
        <Label htmlFor="summary">Resumo</Label>
        <ControlledInput
          hookForm={form}
          name="summary"
          placeholder="Resumo da campanha"
          error={errors.summary?.message}
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
          {data?.id ? "Salvar alterações" : "Criar campanha"}
        </Button>
      </div>
    </form>
  );
};
