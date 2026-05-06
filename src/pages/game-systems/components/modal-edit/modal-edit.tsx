import { Button } from "@/src/components/button/button";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { ControlledTextarea } from "@/src/components/input/input.textarea.controlled";
import { Label } from "@/src/components/label/label";
import { useGameSystemById } from "@/src/features/game-systems/hooks/use-game-system-by-id";
import { useGameSystemsMutation } from "@/src/features/game-systems/hooks/use-game-systems-mutations";
import { type IGameSystem } from "@/src/features/game-systems/schemas/game-system.schema";
import { useImageById } from "@/src/features/images/hooks/use-image-by-id";
import { ImageService } from "@/src/features/images/services/images.services";
import { useBoundStore } from "@/src/store";
import { isImageDataUrl, toImageSource } from "@/src/utils/image";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

type IGameSystemForm = Partial<IGameSystem> & {
  name: string;
  imageContent?: string;
};

export const ModalEdit = ({ data }: { data?: IGameSystem }) => {
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);
  const { data: dataEdit, isLoading } = useGameSystemById(data?.id);
  const { createOrUpdate, isPending } = useGameSystemsMutation();

  const defaultValues = useMemo<IGameSystemForm>(
    () => ({
      name: "",
      description: "",
      imageId: 0,
      imageContent: "",
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
    setValue,
    control,
    formState: { errors, isDirty },
  } = form;

  const selectedImageId = useWatch({ control, name: "imageId" });
  const currentImageContent = useWatch({ control, name: "imageContent" });
  const { data: currentImage } = useImageById(
    selectedImageId ? Number(selectedImageId) : undefined,
  );

  const selectedImageSource = toImageSource(
    currentImage?.url || currentImageContent,
  );

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const { imageContent: _imageContent, ...gameSystemValues } = values;
    let imageId = Number(gameSystemValues.imageId ?? 0);

    if (isImageDataUrl(_imageContent)) {
      try {
        const imageResponse = await ImageService.create({
          type: "GameSystem",
          name: `${gameSystemValues.name || "sistema"}-imagem`,
          content: _imageContent ?? "",
        });

        const uploadedImageId = getImageIdFromResponse(imageResponse);

        if (!uploadedImageId) {
          addToast("error", "Não foi possível identificar a imagem enviada.");
          return;
        }

        imageId = uploadedImageId;
      } catch {
        addToast("error", "Não foi possível enviar a imagem do sistema.");
        return;
      }
    }

    const payload: IGameSystem = {
      ...defaultValues,
      ...gameSystemValues,
      imageId,
      id: dataEdit?.id ?? data?.id ?? values.id,
    };

    delete (payload as IGameSystem & { imageContent?: string }).imageContent;

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
        <ControlledTextarea
          hookForm={form}
          name="description"
          placeholder="Descrição do sistema de jogo"
          error={errors.description?.message}
          isLoading={isLoading}
        />
      </InputGroup>

      <InputGroup className="basis-full">
        <ControlledImageInput
          hookForm={form}
          name="imageContent"
          label="Imagem"
          previewValue={selectedImageSource}
          disabled={isLoading || isPending}
          onClearImage={() => {
            setValue("imageId", 0, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
          }}
          existingImagePicker={{
            imageType: "GameSystem",
            selectedImageId: selectedImageId ? Number(selectedImageId) : undefined,
            emptyMessage: "Nenhuma imagem encontrada.",
            onSelect: (image) => {
              if (!image.id) return;

              setValue("imageId", Number(image.id), {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
              setValue("imageContent", image.url ?? "", {
                shouldDirty: false,
                shouldTouch: false,
                shouldValidate: false,
              });
            },
          }}
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
