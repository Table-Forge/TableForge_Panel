import { Button } from "@/src/components/button/button";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import { IMAGE_TYPE_OPTIONS } from "@/src/constants/select-options";
import { useCampaignsSelect } from "@/src/features/campaigns/hooks/use-campaigns-select";
import { useImageById } from "@/src/features/images/hooks/use-image-by-id";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
import { type IImage } from "@/src/features/images/schemas/image.schema";
import { useUsersSelect } from "@/src/features/users/hooks/use-users-select";
import { useBoundStore } from "@/src/store";
import { toImageSource } from "@/src/utils/image";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

export const ModalEdit = ({ data }: { data?: IImage }) => {
  const closeModal = useBoundStore((state) => state.closeModal);

  const { data: dataEdit, isLoading } = useImageById(data?.id);
  const { createMutation, updateMutation } = useImagesMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const defaultValues = useMemo<IImage>(
    () => ({
      type: "CampaignBanner",
      name: "",
      content: "",
      ...(dataEdit ?? data),
    }),
    [data, dataEdit],
  );

  const form = useForm<IImage>({
    defaultValues,
    mode: "onChange",
  });

  const selectedType = form.watch("type");
  const isUserProfileType = selectedType === "UserProfile";
  const isCampaignBannerType = selectedType === "CampaignBanner";

  const {
    userOptions,
    isLoadingUsersSelect,
    onSearchUsers,
  } = useUsersSelect({
    enabled: isUserProfileType,
  });

  const {
    campaignOptions,
    isLoadingCampaignsSelect,
    onSearchCampaigns,
  } = useCampaignsSelect({
    enabled: isCampaignBannerType,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = form;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!isUserProfileType) {
      setValue("userId", undefined, { shouldDirty: false });
    }
  }, [isUserProfileType, setValue]);

  useEffect(() => {
    if (!isCampaignBannerType) {
      setValue("campaignId", undefined, { shouldDirty: false });
    }
  }, [isCampaignBannerType, setValue]);

  const onSubmit = handleSubmit((values) => {
    const payload: IImage = {
      ...defaultValues,
      ...values,
      userId: isUserProfileType ? values.userId : undefined,
      campaignId: isCampaignBannerType ? values.campaignId : undefined,
    };

    if (payload.id) {
      updateMutation.mutate(payload);
      return;
    }

    createMutation.mutate(payload);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm text-grays-200">
        Configure os dados da imagem e selecione o arquivo abaixo.
      </p>

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="type" isRequired>
            Tipo
          </Label>
          <Select
            hookForm={form}
            name="type"
            initialOptions={IMAGE_TYPE_OPTIONS}
            title="Selecione o tipo"
            error={errors.type?.message}
            searchInput={false}
            disabled={isSubmitting || isLoading}
            isLoading={isSubmitting || isLoading}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="name" isRequired>
            Nome
          </Label>
          <ControlledInput
            hookForm={form}
            name="name"
            placeholder="Nome da imagem"
            error={errors.name?.message}
            isLoading={isSubmitting || isLoading}
          />
        </InputGroup>

        {isCampaignBannerType ? (
          <InputGroup>
            <Label htmlFor="campaignId" isRequired>
              Campanha
            </Label>
            <Select
              hookForm={form}
              name="campaignId"
              initialOptions={campaignOptions}
              title="Selecione a campanha"
              error={errors.campaignId?.message}
              searchInput
              onChangeInputSearch={onSearchCampaigns}
              disabled={isSubmitting || isLoading || isLoadingCampaignsSelect}
              isLoading={isLoadingCampaignsSelect}
              searchPlaceholder="Digite 3 caracteres para pesquisar campanha"
            />
          </InputGroup>
        ) : null}

        {isUserProfileType ? (
          <InputGroup>
            <Label htmlFor="userId" isRequired>
              Usuário
            </Label>
            <Select
              hookForm={form}
              name="userId"
              initialOptions={userOptions}
              title="Selecione o usuário"
              error={errors.userId?.message}
              searchInput
              onChangeInputSearch={onSearchUsers}
              disabled={isSubmitting || isLoading || isLoadingUsersSelect}
              isLoading={isLoadingUsersSelect}
              searchPlaceholder="Digite 3 caracteres para pesquisar usuário"
            />
          </InputGroup>
        ) : null}

        <InputGroup className="basis-full">
          <ControlledImageInput
            hookForm={form}
            name="content"
            label="Conteúdo da imagem *"
            previewValue={toImageSource(dataEdit?.url)}
            disabled={isSubmitting || isLoading}
            error={errors.content?.message}
            onFileNameChange={(fileName) => {
              if (!form.getValues("name")) {
                setValue("name", fileName, { shouldDirty: true });
              }
            }}
          />
        </InputGroup>
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
          {data?.id ? "Salvar alterações" : "Criar imagem"}
        </Button>
      </div>
    </form>
  );
};
