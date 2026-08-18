import { Button } from "@/src/components/button/button";
import { ModalFooter } from "@/src/components/modals/modal-footer";
import { CheckboxControlled } from "@/src/components/checkbox/checkbox-controlled";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { ControlledTextarea } from "@/src/components/input/input.textarea.controlled";
import { Label } from "@/src/components/label/label";
import { ControlledLocationAutocomplete } from "@/src/components/location-autocomplete/location-autocomplete.controlled";
import { Select } from "@/src/components/select/select";
import { useCampaignDifficultyLevelEnum } from "@/src/features/campaigns/hooks/enums/use-campaign-difficulty-level-enum";
import { useCampaignFrequencyEnum } from "@/src/features/campaigns/hooks/enums/use-campaign-frequency-enum";
import { useCampaignStatusEnum } from "@/src/features/campaigns/hooks/enums/use-campaign-status-enum";
import { useCampaignById } from "@/src/features/campaigns/hooks/use-campaign-by-id";
import { useCampaignsMutation } from "@/src/features/campaigns/hooks/use-campaigns-mutations";
import { type ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { useGameSystemsSelect } from "@/src/features/game-systems/hooks/use-game-systems-select";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
import { useUsersSelect } from "@/src/features/users/hooks/use-users-select";
import { useBoundStore } from "@/src/store";
import { isImageDataUrl, toImageSource } from "@/src/utils/image";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

type ICampaignForm = Omit<Partial<ICampaign>, "latitude" | "longitude"> & {
  title: string;
  description: string;
  difficulty: string;
  frequency?: string;
  playersLimit: number;
  status: string;
  isPrivate: boolean;
  isChatEnabled: boolean;
  creatorId: number;
  locationName?: string;
  address?: string;
  latitude?: number | string;
  longitude?: number | string;
  creationLatitude?: number;
  creationLongitude?: number;
  bannerId?: number;
  gameSystemId?: number;
  bannerContent?: string;
};

export const ModalEdit = ({ data }: { data?: ICampaign }) => {
  const addToast = useBoundStore((state) => state.addToast);
  const authUserId = useBoundStore((state) => state.authData?.user?.id);
  const closeModal = useBoundStore((state) => state.closeModal);
  const { data: dataEdit, isLoading } = useCampaignById(data?.id);
  const { createOrUpdate, isPending } = useCampaignsMutation();
  const { createOrUpdate: createOrUpdateImage, isPending: isLoadingImage } =
    useImagesMutation();
  const { difficultyLevelEnum, isLoadingDifficultyLevelEnum } =
    useCampaignDifficultyLevelEnum();
  const { frequencyEnum, isLoadingFrequencyEnum } =
    useCampaignFrequencyEnum();
  const { campaignStatusEnum, isLoadingCampaignStatusEnum } =
    useCampaignStatusEnum();
  const { userOptions, isLoadingUsersSelect, onSearchUsers } = useUsersSelect();
  const { gameSystemOptions, isLoadingGameSystemsSelect } =
    useGameSystemsSelect();

  const defaultValues = useMemo<ICampaignForm>(
    () => ({
      title: "",
      description: "",
      difficulty: "Low",
      frequency: undefined,
      playersLimit: 1,
      status: "Draft",
      isPrivate: false,
      isChatEnabled: true,
      creatorId: Number(authUserId ?? 0),
      locationName: "",
      address: "",
      latitude: "",
      longitude: "",
      creationLatitude: undefined,
      creationLongitude: undefined,
      bannerId: undefined,
      gameSystemId: undefined,
      bannerContent: "",
      ...(dataEdit ?? data),
    }),
    [authUserId, data, dataEdit],
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

  const currentBannerContent = useWatch({ control, name: "bannerContent" });
  const currentBannerId = useWatch({ control, name: "bannerId" });
  const currentAddress = useWatch({ control, name: "address" });
  const currentLatitude = useWatch({ control, name: "latitude" });
  const currentLocationName = useWatch({ control, name: "locationName" });
  const currentLongitude = useWatch({ control, name: "longitude" });

  const selectedBannerSource = toImageSource(
    currentBannerContent ||
      (currentBannerId ? dataEdit?.bannerUrl || data?.bannerUrl : undefined),
  );

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const { bannerContent: _bannerContent, ...campaignValues } = values;
    const hasLocationLatitude =
      campaignValues.latitude !== "" &&
      campaignValues.latitude != null &&
      Number.isFinite(Number(campaignValues.latitude));
    const hasLocationLongitude =
      campaignValues.longitude !== "" &&
      campaignValues.longitude != null &&
      Number.isFinite(Number(campaignValues.longitude));
    const hasSelectedLocation =
      Boolean(campaignValues.locationName?.trim()) &&
      Boolean(campaignValues.address?.trim()) &&
      hasLocationLatitude &&
      hasLocationLongitude;

    if (!hasSelectedLocation) {
      addToast("error", "Selecione uma sugestão de localização válida.");
      return;
    }

    let currentLocation: GeolocationPosition;

    try {
      currentLocation = await getCurrentLocation();
    } catch {
      addToast(
        "error",
        "Permita o acesso à localização para criar a campanha.",
      );
      return;
    }

    const existingBannerId = dataEdit?.bannerId ?? data?.bannerId;
    let bannerId = campaignValues.bannerId
      ? Number(campaignValues.bannerId)
      : undefined;

    if (isImageDataUrl(_bannerContent)) {
      try {
        const imagePayload = {
          id: existingBannerId,
          type: 1,
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
      latitude: Number(campaignValues.latitude),
      longitude: Number(campaignValues.longitude),
      creationLatitude: currentLocation.coords.latitude,
      creationLongitude: currentLocation.coords.longitude,
      bannerId,
      gameSystemId: campaignValues.gameSystemId
        ? Number(campaignValues.gameSystemId)
        : undefined,
      id: dataEdit?.id ?? data?.id ?? values.id,
    };

    delete (payload as ICampaign & { bannerContent?: string }).bannerContent;
    delete (payload as ICampaign & { bannerUrl?: string }).bannerUrl;
    delete (payload as ICampaign & { creatorUsername?: string }).creatorUsername;
    delete (payload as ICampaign & { gameSystemName?: string }).gameSystemName;
    delete (payload as ICampaign & { createdAt?: Date }).createdAt;
    delete (payload as ICampaign & { updatedAt?: Date }).updatedAt;

    if (!payload.id) {
      delete (payload as { id?: number }).id;
    }

    createOrUpdate(payload);
  });

  const isSubmitting = isPending || isLoadingImage;
  const hasLocationLatitude =
    currentLatitude !== "" &&
    currentLatitude != null &&
    Number.isFinite(Number(currentLatitude));
  const hasLocationLongitude =
    currentLongitude !== "" &&
    currentLongitude != null &&
    Number.isFinite(Number(currentLongitude));
  const isLocationSelectionValid =
    Boolean(currentLocationName?.trim()) &&
    Boolean(currentAddress?.trim()) &&
    hasLocationLatitude &&
    hasLocationLongitude;
  const locationSelectionError =
    Boolean(currentAddress || currentLatitude || currentLongitude) &&
    !isLocationSelectionValid;

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
            initialOptions={difficultyLevelEnum}
            title="Selecione a dificuldade"
            error={errors.difficulty?.message}
            searchInput={false}
            disabled={isLoading || isLoadingDifficultyLevelEnum}
            isLoading={isLoading || isLoadingDifficultyLevelEnum}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="frequency">
            Frequência
          </Label>
          <Select
            hookForm={form}
            name="frequency"
            initialOptions={frequencyEnum}
            title="Selecione a frequência (opcional)"
            error={errors.frequency?.message}
            searchInput={false}
            disabled={isLoading || isLoadingFrequencyEnum}
            isLoading={isLoading || isLoadingFrequencyEnum}
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
            initialOptions={campaignStatusEnum}
            title="Selecione o status"
            error={errors.status?.message}
            searchInput={false}
            disabled={isLoading || isLoadingCampaignStatusEnum}
            isLoading={isLoading || isLoadingCampaignStatusEnum}
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
            min={1}
            step={1}
            placeholder="1"
            disabled={isLoading || isSubmitting}
          />
        </InputGroup>
      </FieldsWrapper>

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="creatorId" isRequired>
            Criador
          </Label>
          <Select
            hookForm={form}
            name="creatorId"
            initialOptions={userOptions}
            title="Selecione o criador"
            error={errors.creatorId?.message}
            searchInput
            searchPlaceholder="Buscar usuário"
            onChangeInputSearch={onSearchUsers}
            isLoading={isLoadingUsersSelect}
            disabled={isLoading || isSubmitting}
          />
        </InputGroup>

        <InputGroup className="basis-full">
          <Label htmlFor="locationName" isRequired>
            Localização
          </Label>
          <ControlledLocationAutocomplete
            hookForm={form}
            name="locationName"
            hasSelectionError={locationSelectionError}
            isSelectionValid={isLocationSelectionValid}
            disabled={isLoading || isSubmitting}
            onClearSelection={() => {
              setValue("address", "", { shouldValidate: false });
              setValue("latitude", "", { shouldValidate: false });
              setValue("longitude", "", { shouldValidate: false });
            }}
            onSelectLocation={(location) => {
              setValue("address", location.address, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
              setValue("latitude", location.latitude, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
              setValue("longitude", location.longitude, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
            }}
          />
        </InputGroup>
      </FieldsWrapper>

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="gameSystemId">
            Sistema de jogo
          </Label>
          <Select
            hookForm={form}
            name="gameSystemId"
            initialOptions={gameSystemOptions}
            title="Selecione o sistema de jogo"
            error={errors.gameSystemId?.message}
            searchInput
            isLoading={isLoadingGameSystemsSelect}
            disabled={isLoading || isSubmitting}
          />
        </InputGroup>
      </FieldsWrapper>

      <InputGroup className="basis-full">
        <Label htmlFor="description">
          Descrição
        </Label>
        <ControlledTextarea
          hookForm={form}
          name="description"
          placeholder="Descrição da campanha"
          error={errors.description?.message}
          isLoading={isLoading}
          maxLength={500}
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
            setValue("bannerId", undefined, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
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

      <ModalFooter>
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
      </ModalFooter>
    </form>
  );
};

function getCurrentLocation() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalização indisponível."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
