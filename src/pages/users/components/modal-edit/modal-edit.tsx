import {
  Button,
  ControlledImageInput,
  ControlledInput,
  FieldsWrapper,
  InputGroup,
  Label,
  Select,
} from "@/src/components";
import { USER_TYPE_OPTIONS } from "@/src/constants/select-options";
import { useImages } from "@/src/features/images/hooks/use-images";
import { type IImage } from "@/src/features/images/schemas/image.schema";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
import { useUserById } from "@/src/features/users/hooks/use-user-by-id";
import { useUserEnums } from "@/src/features/users/hooks/use-user-enums";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
import { type IUser } from "@/src/features/users/schemas/user.schema";
import { useBoundStore } from "@/src/store";
import { isImageDataUrl, toImageSource } from "@/src/utils/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const PICKER_PAGE_SIZE = 24;

export const ModalEdit = ({ data }: { data?: IUser }) => {
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);

  const { data: dataEdit, isLoading } = useUserById(data?.id);
  const { createOrUpdate, isPending } = useUsersMutation();

  const { createOrUpdate: createOrUpdateImage, isPending: isLoadingImage } =
    useImagesMutation();

  const { genderEnum, isLoadingGenderEnum } = useUserEnums();
  const isCreateMode = !data?.id;

  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [imageSearch, setImageSearch] = useState("");

  const { data: imagesData, isLoading: isLoadingImages } = useImages({
    page: 1,
    size: PICKER_PAGE_SIZE,
    search: imageSearch,
    enabled: isImagePickerOpen,
  });

  const availableUserImages = useMemo<IImage[]>(
    () =>
      (imagesData?.items ?? []).filter((image) => image.type === "UserProfile"),
    [imagesData?.items],
  );

  const defaultValues = useMemo<IUser>(
    () => ({
      ...(dataEdit ?? data),
    }),
    [data, dataEdit],
  );

  const form = useForm<IUser>({
    defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = form;

  const currentAvatar = watch("avatarUrl");
  const selectedAvatarSource = toImageSource(currentAvatar);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleSelectExistingImage = (image: IImage) => {
    if (!image.url) return;

    setValue("avatarUrl", image.url, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setIsImagePickerOpen(false);
  };

  const onSubmit = handleSubmit(async (formData) => {
    const payload: IUser = {
      ...defaultValues,
      ...formData,
      id: dataEdit?.id ?? data?.id ?? formData.id,
    };

    const avatarContent = formData.avatarUrl ?? "";

    if (isImageDataUrl(avatarContent)) {
      try {
        const imagePayload = {
          type: "UserProfile" as const,
          name: `${payload.username ?? payload.nickname ?? "usuario"}-avatar`,
          content: avatarContent,
        };

        const imageUrl = await createOrUpdateImage(imagePayload);

        payload.avatarUrl = imageUrl;
      } catch {
        addToast("error", "Não foi possível enviar a imagem do usuário.");
        return;
      }
    }

    createOrUpdate(payload);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="username" isRequired>
            Usuário
          </Label>
          <ControlledInput
            hookForm={form}
            name="username"
            placeholder="Usuário"
            error={errors.username?.message}
            isLoading={isLoading}
            removeSpaces
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="nickname" isRequired>
            Nickname
          </Label>
          <ControlledInput
            hookForm={form}
            name="nickname"
            placeholder="Digite o Nickname"
            error={errors.nickname?.message}
            isLoading={isLoading}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="email" isRequired>
            E-mail
          </Label>
          <ControlledInput
            hookForm={form}
            name="email"
            placeholder="Digite o e-mail"
            error={errors.email?.message}
            sanitizeEmail
            isLoading={isLoading}
            removeSpaces
          />
        </InputGroup>
      </FieldsWrapper>

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="gender">Gênero</Label>
          <Select
            hookForm={form}
            name="gender"
            initialOptions={genderEnum}
            title="Selecione o gênero"
            error={errors.gender?.message}
            searchInput={false}
            disabled={isLoadingGenderEnum}
            isLoading={isLoadingGenderEnum}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="type" isRequired={isCreateMode}>
            Tipo de perfil
          </Label>
          <Select
            hookForm={form}
            name="type"
            initialOptions={USER_TYPE_OPTIONS}
            title="Selecione o tipo"
            error={errors.type?.message}
            searchInput={false}
            disabled={!isCreateMode || isPending || isLoadingImage || isLoading}
          />
        </InputGroup>
      </FieldsWrapper>

      <InputGroup className="basis-full">
        <ControlledImageInput
          hookForm={form}
          name="avatarUrl"
          label="Avatar"
          previewValue={toImageSource(dataEdit?.avatarUrl)}
          disabled={isLoading || isPending || isLoadingImage}
        />

        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            buttonStyle="secondary"
            onClick={() => setIsImagePickerOpen(true)}
            disabled={isLoading || isPending || isLoadingImage}
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
              ) : availableUserImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {availableUserImages.map((image) => {
                    const previewSource = toImageSource(image.url);
                    const isSelected =
                      previewSource &&
                      selectedAvatarSource &&
                      previewSource === selectedAvatarSource;

                    return (
                      <button
                        key={String(image.id ?? image.uuid)}
                        type="button"
                        onClick={() => handleSelectExistingImage(image)}
                        disabled={!previewSource}
                        className={`rounded-xl border p-2 text-left transition ${
                          isSelected
                            ? "border-secondary bg-secondary/10"
                            : "border-white/15 bg-background/40 hover:border-white/30"
                        } ${previewSource ? "opacity-100" : "opacity-60"}`}
                      >
                        <div className="mb-2 aspect-square overflow-hidden rounded-lg border border-white/15 bg-background/60">
                          {previewSource ? (
                            <img
                              src={previewSource}
                              alt={image.name || "Imagem de perfil"}
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
                  Nenhuma imagem de perfil encontrada.
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
          isLoading={isPending || isLoadingImage}
          disabled={!isDirty || isPending || isLoadingImage}
        >
          Salvar alterações
        </Button>
      </div>
    </form>
  );
};
