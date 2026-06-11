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
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
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
  const { createOrUpdate: createOrUpdateImage, isPending: isLoadingImage } =
    useImagesMutation();

  const defaultValues = useMemo<IGameSystemForm>(
    () => ({
      name: "",
      description: "",
      imageId: undefined,
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

  const currentImageContent = useWatch({ control, name: "imageContent" });
  const currentImageId = useWatch({ control, name: "imageId" });

  const selectedImageSource = toImageSource(
    currentImageContent ||
      (currentImageId ? dataEdit?.imageUrl || data?.imageUrl : undefined),
  );

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const { imageContent: _imageContent, ...gameSystemValues } = values;
    let imageId = gameSystemValues.imageId
      ? Number(gameSystemValues.imageId)
      : undefined;

    if (isImageDataUrl(_imageContent)) {
      try {
        const imagePayload = {
          id: imageId,
          type: "GameSystem" as const,
          name: `${gameSystemValues.name || "sistema"}-imagem`,
          content: _imageContent ?? "",
        };

        const imageResponse = await createOrUpdateImage(imagePayload);

        if (!imageResponse.id) {
          addToast("error", "Não foi possível identificar a imagem enviada.");
          return;
        }

        imageId = Number(imageResponse.id);
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
    delete (payload as IGameSystem & { imageUrl?: string }).imageUrl;
    delete (payload as IGameSystem & { createdAt?: Date }).createdAt;
    delete (payload as IGameSystem & { updatedAt?: Date }).updatedAt;

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
          maxLength={500}
        />
      </InputGroup>

      <InputGroup className="basis-full">
        <Label htmlFor="imageContent">Imagem</Label>
        <ControlledImageInput
          hookForm={form}
          name="imageContent"
          previewValue={selectedImageSource}
          disabled={isLoading || isPending || isLoadingImage}
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
          disabled={!isDirty || isLoading || isPending || isLoadingImage}
        >
          {data?.id ? "Salvar alterações" : "Criar sistema"}
        </Button>
      </div>
    </form>
  );
};
