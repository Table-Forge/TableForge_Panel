import { Button } from "@/src/components/button/button";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { Label } from "@/src/components/label/label";
import { useGameSystemById } from "@/src/features/game-systems/hooks/use-game-system-by-id";
import { useGameSystemsMutation } from "@/src/features/game-systems/hooks/use-game-systems-mutations";
import { type IGameSystem } from "@/src/features/game-systems/schemas/game-system.schema";
import { useAllImages } from "@/src/features/images/hooks/use-all-images";
import { type IImage } from "@/src/features/images/schemas/image.schema";
import { ImageService } from "@/src/features/images/services/images.services";
import { useBoundStore } from "@/src/store";
import { isImageDataUrl, toImageSource } from "@/src/utils/image";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

const PICKER_PAGE_SIZE = 24;

type IGameSystemForm = Partial<IGameSystem> & {
  name: string;
  imageContent?: string;
};

export const ModalEdit = ({ data }: { data?: IGameSystem }) => {
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);
  const { data: dataEdit, isLoading } = useGameSystemById(data?.id);
  const { createOrUpdate, isPending } = useGameSystemsMutation();

  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [imageSearch, setImageSearch] = useState("");

  const { data: imagesData, isLoading: isLoadingImages } = useAllImages({
    page: 1,
    size: PICKER_PAGE_SIZE,
    search: imageSearch,
    enabled: isImagePickerOpen,
  });

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

  const availableImages = useMemo<IImage[]>(
    () => imagesData?.items ?? [],
    [imagesData?.items],
  );

  const selectedImage = useMemo(
    () =>
      availableImages.find(
        (image) =>
          image.id !== undefined &&
          selectedImageId !== undefined &&
          Number(image.id) === Number(selectedImageId),
      ),
    [availableImages, selectedImageId],
  );

  const selectedImageSource = toImageSource(
    selectedImage?.url || currentImageContent,
  );

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleSelectExistingImage = (image: IImage) => {
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
    setIsImagePickerOpen(false);
  };

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

        imageId = getImageIdFromResponse(imageResponse);

        if (!imageId) {
          addToast("error", "Não foi possível identificar a imagem enviada.");
          return;
        }
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
        <ControlledInput
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
        />

        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            buttonStyle="secondary"
            onClick={() => setIsImagePickerOpen(true)}
            disabled={isLoading || isPending}
          >
            Usar imagem existente
          </Button>
        </div>
      </InputGroup>

      {isImagePickerOpen ? (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-background/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsImagePickerOpen(false);
            }
          }}
        >
          <section className="w-full max-w-4xl rounded-2xl border border-white/15 bg-primary shadow-2xl">
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h3 className="text-lg font-bold text-white">
                Selecionar imagem existente
              </h3>
              <button
                type="button"
                onClick={() => setIsImagePickerOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-white/80 hover:bg-white/10 hover:text-white"
              >
                X
              </button>
            </header>

            <div className="space-y-4 p-4">
              <input
                value={imageSearch}
                onChange={(event) => setImageSearch(event.target.value)}
                placeholder="Buscar imagem por nome"
                className="h-10 w-full rounded-xl border border-white/15 bg-background/60 px-3 text-sm text-white outline-none placeholder:text-white/35"
              />

              {isLoadingImages ? (
                <p className="text-sm text-white/75">Carregando imagens...</p>
              ) : availableImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {availableImages.map((image) => {
                    const previewSource = toImageSource(image.url);
                    const isSelected =
                      image.id !== undefined &&
                      selectedImageId !== undefined &&
                      Number(image.id) === Number(selectedImageId);

                    return (
                      <button
                        key={String(image.id ?? image.uuid)}
                        type="button"
                        onClick={() => handleSelectExistingImage(image)}
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
                              alt={image.name || "Imagem do sistema"}
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
                  Nenhuma imagem encontrada.
                </p>
              )}
            </div>
          </section>
        </div>
      ) : null}

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
