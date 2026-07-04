import { Button } from "@/src/components/button/button";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { ControlledTextarea } from "@/src/components/input/input.textarea.controlled";
import { Label } from "@/src/components/label/label";
import { useBannersMutation } from "@/src/features/banners/hooks/use-banners-mutations";
import { type IBanner, type IBannerCreate } from "@/src/features/banners/schemas/banner.schema";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
import { useBoundStore } from "@/src/store";
import { isImageDataUrl, toImageSource } from "@/src/utils/image";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

type IBannerForm = Partial<IBanner> & {
  title: string;
  description: string;
  imageContent?: string;
};

export const ModalEdit = ({ data }: { data?: IBanner }) => {
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);
  
  const { createMutation, updateMutation } = useBannersMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;
  
  const { createOrUpdate: createOrUpdateImage, isPending: isLoadingImage } =
    useImagesMutation();

  const defaultValues = useMemo<IBannerForm>(
    () => ({
      title: "",
      description: "",
      tag: "",
      link: "",
      order: 0,
      imageId: undefined,
      imageContent: "",
      ...data,
    }),
    [data],
  );

  const form = useForm<IBannerForm>({
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

  const currentImageContent = useWatch({ control, name: "imageContent" });

  const selectedImageSource = currentImageContent ? toImageSource(currentImageContent) : (data?.imageUrl ? toImageSource(data.imageUrl) : undefined);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const { imageContent: _imageContent, ...bannerValues } = values;
    const existingImageId = data?.imageId;
    let imageId = bannerValues.imageId
      ? Number(bannerValues.imageId)
      : undefined;

    if (isImageDataUrl(_imageContent)) {
      try {
        const imagePayload = {
          id: existingImageId ?? undefined,
          type: 4,
          name: `${bannerValues.title || "banner"}-imagem`,
          content: _imageContent ?? "",
        };

        const imageResponse = await createOrUpdateImage(imagePayload);

        if (!imageResponse.id) {
          addToast("error", "Não foi possível identificar a imagem enviada.");
          return;
        }

        imageId = Number(imageResponse.id);
      } catch {
        addToast("error", "Não foi possível enviar a imagem do banner.");
        return;
      }
    }

    const payload: IBanner = {
      ...defaultValues,
      ...bannerValues,
      order: Number(bannerValues.order) || 0,
      imageId,
      id: data?.id ?? values.id ?? 0,
    };

    delete (payload as IBanner & { imageContent?: string }).imageContent;
    delete (payload as IBanner & { imageUrl?: string }).imageUrl;

    if (!payload.id || payload.id === 0) {
      createMutation.mutate(payload as unknown as IBannerCreate);
    } else {
      updateMutation.mutate(payload as IBanner & { id: number });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="title" isRequired>Título</Label>
          <ControlledInput
            hookForm={form}
            name="title"
            placeholder="Digite o título do banner"
            error={errors.title?.message}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="tag">Tag (opcional)</Label>
          <ControlledInput
            hookForm={form}
            name="tag"
            placeholder="Ex: NOVO, DESTAQUE"
            error={errors.tag?.message}
          />
        </InputGroup>
      </FieldsWrapper>

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="link">Link (opcional)</Label>
          <ControlledInput
            hookForm={form}
            name="link"
            placeholder="Link de redirecionamento"
            error={errors.link?.message}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="order">Ordem</Label>
          <ControlledInput
            hookForm={form}
            name="order"
            type="number"
            placeholder="0"
            error={errors.order?.message}
          />
        </InputGroup>
      </FieldsWrapper>

      <InputGroup className="basis-full">
        <Label htmlFor="description" isRequired>Descrição</Label>
        <ControlledTextarea
          hookForm={form}
          name="description"
          placeholder="Descrição do banner"
          error={errors.description?.message}
          maxLength={500}
        />
      </InputGroup>

      <InputGroup className="basis-full">
        <Label htmlFor="imageContent">Imagem do Banner</Label>
        <ControlledImageInput
          hookForm={form}
          name="imageContent"
          previewValue={selectedImageSource}
          disabled={isPending || isLoadingImage}
          onClearImage={() => {
            setValue("imageId", undefined, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
          }}
        />
      </InputGroup>

      <div className="mt-6 flex justify-end gap-3">
        <Button buttonStyle="hollow" onClick={closeModal} type="button">
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isPending || isLoadingImage}
          disabled={!isDirty || isPending || isLoadingImage}
        >
          {data?.id ? "Salvar alterações" : "Criar banner"}
        </Button>
      </div>
    </form>
  );
};
