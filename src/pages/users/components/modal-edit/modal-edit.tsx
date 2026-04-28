import { Button } from "@/src/components/button/button";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import { USER_TYPE_OPTIONS } from "@/src/constants/select-options";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
import { useUserGenderEnum } from "@/src/features/users/hooks/enums/use-user-gender-enum";
import { useUserById } from "@/src/features/users/hooks/use-user-by-id";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
import { type IUser } from "@/src/features/users/schemas/user.schema";
import { useBoundStore } from "@/src/store";
import { isImageDataUrl, toImageSource } from "@/src/utils/image";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

export const ModalEdit = ({ data }: { data?: IUser }) => {
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);

  const { data: dataEdit, isLoading } = useUserById(data?.id);
  const { createOrUpdate, isPending } = useUsersMutation();

  const { createOrUpdate: createOrUpdateImage, isPending: isLoadingImage } =
    useImagesMutation();

  const { genderEnum, isLoadingGenderEnum } = useUserGenderEnum();
  const isCreateMode = !data?.id;

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
          existingImagePicker={{
            imageType: "UserProfile",
            selectedImageUrl: selectedAvatarSource,
            emptyMessage: "Nenhuma imagem de perfil encontrada.",
            onSelect: (image) => {
              if (!image.url) return;

              setValue("avatarUrl", image.url, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
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
          isLoading={isPending || isLoadingImage}
          disabled={!isDirty || isPending || isLoadingImage}
        >
          Salvar alterações
        </Button>
      </div>
    </form>
  );
};
