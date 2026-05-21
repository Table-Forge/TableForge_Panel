import { Button } from "@/src/components/button/button";
import { CheckboxControlled } from "@/src/components/checkbox/checkbox-controlled";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { ControlledTextarea } from "@/src/components/input/input.textarea.controlled";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import {
  CAMPAIGN_DIFFICULTY_OPTIONS,
  CAMPAIGN_STATUS_OPTIONS,
} from "@/src/constants/select-options";
import { useCampaignById } from "@/src/features/campaigns/hooks/use-campaign-by-id";
import { useCampaignsMutation } from "@/src/features/campaigns/hooks/use-campaigns-mutations";
import { type ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { useImageById } from "@/src/features/images/hooks/use-image-by-id";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
import { useBoundStore } from "@/src/store";
import { isImageDataUrl, toImageSource } from "@/src/utils/image";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

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
  bannerContent?: string;
};

export const ModalEdit = ({ data }: { data?: ICampaign }) => {
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);
  const { data: dataEdit, isLoading } = useCampaignById(data?.id);
  const { createOrUpdate, isPending } = useCampaignsMutation();
  const { createOrUpdate: createOrUpdateImage, isPending: isLoadingImage } =
    useImagesMutation();

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
      bannerContent: "",
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
    setValue,
    control,
    formState: { errors, isDirty },
  } = form;

  const selectedBannerId = useWatch({ control, name: "bannerId" });
  const currentBannerContent = useWatch({ control, name: "bannerContent" });
  const { data: currentBanner } = useImageById(
    selectedBannerId ? Number(selectedBannerId) : undefined,
  );

  const selectedBannerSource = toImageSource(
    currentBanner?.url || currentBannerContent,
  );

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const { bannerContent: _bannerContent, ...campaignValues } = values;
    let bannerId = Number(campaignValues.bannerId ?? 0);

    if (isImageDataUrl(_bannerContent)) {
      try {
        const imagePayload = {
          type: "CampaignBanner" as const,
          name: `${campaignValues.title || "campanha"}-banner`,
          content: _bannerContent ?? "",
        };

        const imageResponse = await createOrUpdateImage(imagePayload);

        if (!imageResponse.id) {
          addToast("error", "Não foi possível identificar o banner enviado.");
          return;
        }

        bannerId = Number(imageResponse.id);
      } catch {
        addToast("error", "Não foi possível enviar o banner da campanha.");
        return;
      }
    }

    const payload: ICampaign = {
      ...defaultValues,
      ...campaignValues,
      playersLimit: Number(campaignValues.playersLimit ?? 0),
      creatorId: Number(campaignValues.creatorId ?? 0),
      locationId: Number(campaignValues.locationId ?? 0),
      bannerId,
      gameSystemId: Number(campaignValues.gameSystemId ?? 0),
      id: dataEdit?.id ?? data?.id ?? values.id,
    };

    delete (payload as ICampaign & { bannerContent?: string }).bannerContent;

    if (!payload.id) {
      delete (payload as { id?: number }).id;
    }

    createOrUpdate(payload);
  });

  const isSubmitting = isPending || isLoadingImage;

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
            disabled={isLoading || isSubmitting}
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
            disabled={isLoading || isSubmitting}
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
            disabled={isLoading || isSubmitting}
          />
        </InputGroup>
      </FieldsWrapper>

      <FieldsWrapper>
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
            disabled={isLoading || isSubmitting}
          />
        </InputGroup>
      </FieldsWrapper>

      <InputGroup className="basis-full">
        <Label htmlFor="description" isRequired>
          Descrição
        </Label>
        <ControlledTextarea
          hookForm={form}
          name="description"
          placeholder="Descrição da campanha"
          error={errors.description?.message}
          isLoading={isLoading}
        />
      </InputGroup>

      <InputGroup className="basis-full">
        <Label htmlFor="bannerContent">Banner</Label>
        <ControlledImageInput
          hookForm={form}
          name="bannerContent"
          previewValue={selectedBannerSource}
          disabled={isLoading || isSubmitting}
          onClearImage={() => {
            setValue("bannerId", 0, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
          }}
          existingImagePicker={{
            imageType: "CampaignBanner",
            selectedImageId: selectedBannerId
              ? Number(selectedBannerId)
              : undefined,
            title: "Selecionar banner existente",
            searchPlaceholder: "Buscar banner por nome",
            emptyMessage: "Nenhum banner encontrado.",
            onSelect: (image) => {
              if (!image.id) return;

              setValue("bannerId", Number(image.id), {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
              setValue("bannerContent", image.url ?? "", {
                shouldDirty: false,
                shouldTouch: false,
                shouldValidate: false,
              });
            },
          }}
        />
      </InputGroup>

      <FieldsWrapper>
        <CheckboxControlled
          hookForm={form}
          name="isPrivate"
          label="Campanha privada"
          disabled={isLoading || isSubmitting}
        />

        <CheckboxControlled
          hookForm={form}
          name="isChatEnabled"
          label="Chat habilitado"
          disabled={isLoading || isSubmitting}
          defaultValue
        />
      </FieldsWrapper>

      <div className="mt-6 flex justify-end gap-3">
        <Button buttonStyle="hollow" onClick={closeModal} type="button">
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!isDirty || isLoading || isSubmitting}
        >
          {data?.id ? "Salvar alterações" : "Criar campanha"}
        </Button>
      </div>
    </form>
  );
};
