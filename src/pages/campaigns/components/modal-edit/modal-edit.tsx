import { Button } from "@/src/components/button/button";
import { CheckboxControlled } from "@/src/components/checkbox/checkbox-controlled";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import {
  CAMPAIGN_DIFFICULTY_OPTIONS,
  CAMPAIGN_STATUS_OPTIONS,
} from "@/src/constants/select-options";
import { useCampaignById } from "@/src/features/campaigns/hooks/use-campaign-by-id";
import { useCampaignsMutation } from "@/src/features/campaigns/hooks/use-campaigns-mutations";
import { type ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { useAllImages } from "@/src/features/images/hooks/use-all-images";
import { useImageById } from "@/src/features/images/hooks/use-image-by-id";
import { type IImage } from "@/src/features/images/schemas/image.schema";
import { ImageService } from "@/src/features/images/services/images.services";
import { useBoundStore } from "@/src/store";
import { isImageDataUrl, toImageSource } from "@/src/utils/image";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

const PICKER_PAGE_SIZE = 24;

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

  const [isBannerPickerOpen, setIsBannerPickerOpen] = useState(false);
  const [bannerSearch, setBannerSearch] = useState("");
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const { data: imagesData, isLoading: isLoadingImages } = useAllImages({
    page: 1,
    size: PICKER_PAGE_SIZE,
    search: bannerSearch,
    enabled: isBannerPickerOpen,
  });

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

  const availableBanners = useMemo<IImage[]>(
    () =>
      (imagesData?.items ?? []).filter(
        (image) => image.type === "CampaignBanner",
      ),
    [imagesData?.items],
  );

  const selectedBanner = useMemo(
    () =>
      availableBanners.find(
        (image) =>
          image.id !== undefined &&
          selectedBannerId !== undefined &&
          Number(image.id) === Number(selectedBannerId),
      ),
    [availableBanners, selectedBannerId],
  );

  const selectedBannerSource = toImageSource(
    selectedBanner?.url || currentBanner?.url || currentBannerContent,
  );

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleSelectExistingBanner = (image: IImage) => {
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
    setIsBannerPickerOpen(false);
  };

  const onSubmit = handleSubmit(async (values) => {
    const { bannerContent: _bannerContent, ...campaignValues } = values;
    let bannerId = Number(campaignValues.bannerId ?? 0);

    if (isImageDataUrl(_bannerContent)) {
      try {
        setIsUploadingBanner(true);
        const imageResponse = await ImageService.create({
          type: "CampaignBanner",
          name: `${campaignValues.title || "campanha"}-banner`,
          content: _bannerContent ?? "",
        });

        bannerId = getImageIdFromResponse(imageResponse);

        if (!bannerId) {
          addToast("error", "Não foi possível identificar o banner enviado.");
          return;
        }
      } catch {
        addToast("error", "Não foi possível enviar o banner da campanha.");
        return;
      } finally {
        setIsUploadingBanner(false);
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

  const isSubmitting = isPending || isUploadingBanner;

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
        <ControlledInput
          hookForm={form}
          name="description"
          placeholder="Descrição da campanha"
          error={errors.description?.message}
          isLoading={isLoading}
        />
      </InputGroup>

      <InputGroup className="basis-full">
        <ControlledImageInput
          hookForm={form}
          name="bannerContent"
          label="Banner"
          previewValue={selectedBannerSource}
          disabled={isLoading || isSubmitting}
        />

        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            buttonStyle="secondary"
            onClick={() => setIsBannerPickerOpen(true)}
            disabled={isLoading || isSubmitting}
          >
            Usar imagem existente
          </Button>
        </div>
      </InputGroup>

      {isBannerPickerOpen ? (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-background/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsBannerPickerOpen(false);
            }
          }}
        >
          <section className="w-full max-w-4xl rounded-2xl border border-white/15 bg-primary shadow-2xl">
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h3 className="text-lg font-bold text-white">
                Selecionar banner existente
              </h3>
              <button
                type="button"
                onClick={() => setIsBannerPickerOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-white/80 hover:bg-white/10 hover:text-white"
              >
                X
              </button>
            </header>

            <div className="space-y-4 p-4">
              <input
                value={bannerSearch}
                onChange={(event) => setBannerSearch(event.target.value)}
                placeholder="Buscar banner por nome"
                className="h-10 w-full rounded-xl border border-white/15 bg-background/60 px-3 text-sm text-white outline-none placeholder:text-white/35"
              />

              {isLoadingImages ? (
                <p className="text-sm text-white/75">Carregando banners...</p>
              ) : availableBanners.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {availableBanners.map((image) => {
                    const previewSource = toImageSource(image.url);
                    const isSelected =
                      image.id !== undefined &&
                      selectedBannerId !== undefined &&
                      Number(image.id) === Number(selectedBannerId);

                    return (
                      <button
                        key={String(image.id ?? image.uuid)}
                        type="button"
                        onClick={() => handleSelectExistingBanner(image)}
                        disabled={!image.id || !previewSource}
                        className={`rounded-xl border p-2 text-left transition ${
                          isSelected
                            ? "border-secondary bg-secondary/10"
                            : "border-white/15 bg-background/40 hover:border-white/30"
                        } ${image.id && previewSource ? "opacity-100" : "opacity-60"}`}
                      >
                        <div className="mb-2 aspect-square overflow-hidden rounded-lg border border-white/15 bg-background/60">
                          {previewSource ? (
                            <img
                              src={previewSource}
                              alt={image.name || "Banner da campanha"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-white/55">
                              Sem prévia
                            </div>
                          )}
                        </div>
                        <p className="truncate text-xs text-white/90">
                          {image.name || `Imagem ${image.id ?? ""}`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-white/75">
                  Nenhum banner encontrado.
                </p>
              )}
            </div>
          </section>
        </div>
      ) : null}

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

function getImageIdFromResponse(response: unknown) {
  if (typeof response === "number") return response;

  if (typeof response === "string") {
    const parsed = Number(response);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  if (response && typeof response === "object" && "id" in response) {
    const parsed = Number((response as { id?: unknown }).id);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}
