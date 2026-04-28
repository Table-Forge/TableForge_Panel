import { Button } from "@/src/components/button/button";
import { CheckboxControlled } from "@/src/components/checkbox/checkbox-controlled";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import {
  CAMPAIGN_DIFFICULTY_OPTIONS,
  CAMPAIGN_STATUS_OPTIONS,
} from "@/src/constants/select-options";
import { useCampaignById } from "@/src/features/campaigns/hooks/use-campaign-by-id";
import { useCampaignsMutation } from "@/src/features/campaigns/hooks/use-campaigns-mutations";
import { type ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { useBoundStore } from "@/src/store";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type ICampaignForm = Partial<ICampaign> & {
  title: string;
  description: string;
  difficulty: string;
  playersLimit: number;
  status: string;
  isPrivate: boolean;
  isChatEnabled: boolean;
  creatorId: number;
  locationId: number;
  bannerId: number;
  gameSystemId: number;
};

export const ModalEdit = ({ data }: { data?: ICampaign }) => {
  const closeModal = useBoundStore((state) => state.closeModal);
  const { data: dataEdit, isLoading } = useCampaignById(data?.id);
  const { createOrUpdate, isPending } = useCampaignsMutation();

  const defaultValues = useMemo<ICampaignForm>(
    () => ({
      title: "",
      description: "",
      difficulty: "None",
      playersLimit: 0,
      status: "None",
      isPrivate: false,
      isChatEnabled: true,
      creatorId: 0,
      locationId: 0,
      bannerId: 0,
      gameSystemId: 0,
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
      playersLimit: Number(values.playersLimit ?? 0),
      creatorId: Number(values.creatorId ?? 0),
      locationId: Number(values.locationId ?? 0),
      bannerId: Number(values.bannerId ?? 0),
      gameSystemId: Number(values.gameSystemId ?? 0),
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
          <Label htmlFor="difficulty" isRequired>
            Dificuldade
          </Label>
          <Select
            hookForm={form}
            name="difficulty"
            initialOptions={CAMPAIGN_DIFFICULTY_OPTIONS}
            title="Selecione a dificuldade"
            error={errors.difficulty?.message}
            searchInput={false}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </InputGroup>
      </FieldsWrapper>

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="status" isRequired>
            Status
          </Label>
          <Select
            hookForm={form}
            name="status"
            initialOptions={CAMPAIGN_STATUS_OPTIONS}
            title="Selecione o status"
            error={errors.status?.message}
            searchInput={false}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="playersLimit" isRequired>
            Limite de jogadores
          </Label>
          <ControlledInput
            hookForm={form}
            name="playersLimit"
            type="number"
            min={0}
            step={1}
            placeholder="0"
            disabled={isLoading || isPending}
          />
        </InputGroup>
      </FieldsWrapper>

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="creatorId" isRequired>
            ID do criador
          </Label>
          <ControlledInput
            hookForm={form}
            name="creatorId"
            type="number"
            min={0}
            step={1}
            placeholder="0"
            disabled={isLoading || isPending}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="locationId" isRequired>
            ID da localização
          </Label>
          <ControlledInput
            hookForm={form}
            name="locationId"
            type="number"
            min={0}
            step={1}
            placeholder="0"
            disabled={isLoading || isPending}
          />
        </InputGroup>
      </FieldsWrapper>

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="bannerId" isRequired>
            ID do banner
          </Label>
          <ControlledInput
            hookForm={form}
            name="bannerId"
            type="number"
            min={0}
            step={1}
            placeholder="0"
            disabled={isLoading || isPending}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="gameSystemId" isRequired>
            ID do sistema de jogo
          </Label>
          <ControlledInput
            hookForm={form}
            name="gameSystemId"
            type="number"
            min={0}
            step={1}
            placeholder="0"
            disabled={isLoading || isPending}
          />
        </InputGroup>
      </FieldsWrapper>

      <InputGroup className="basis-full">
        <Label htmlFor="description" isRequired>
          Descrição
        </Label>
        <ControlledInput
          hookForm={form}
          name="description"
          placeholder="Descrição da campanha"
          error={errors.description?.message}
          isLoading={isLoading}
        />
      </InputGroup>

      <FieldsWrapper>
        <CheckboxControlled
          hookForm={form}
          name="isPrivate"
          label="Campanha privada"
          disabled={isLoading || isPending}
        />

        <CheckboxControlled
          hookForm={form}
          name="isChatEnabled"
          label="Chat habilitado"
          disabled={isLoading || isPending}
          defaultValue
        />
      </FieldsWrapper>

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
