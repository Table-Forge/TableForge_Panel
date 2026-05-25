import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { Button } from "@/src/components/button/button";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { DateInput } from "@/src/components/input/input.date.controlled";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { ControlledPasswordInput } from "@/src/components/input/input.password.controlled";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import { USER_TYPE_OPTIONS } from "@/src/constants/select-options";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
import { useUserGenderEnum } from "@/src/features/users/hooks/enums/use-user-gender-enum";
import { useUserById } from "@/src/features/users/hooks/use-user-by-id";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
import { type IUser, UserSchema } from "@/src/features/users/schemas/user.schema";
import { useBoundStore } from "@/src/store";
import { isImageDataUrl, toImageSource } from "@/src/utils/image";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

export const ModalEdit = ({ data }: { data?: IUser }) => {
  const addToast = useBoundStore((state) => state.addToast);
  const authUserId = useBoundStore((state) => state.authData?.user?.id);
  const closeModal = useBoundStore((state) => state.closeModal);

  const { data: dataEdit, isLoading } = useUserById(data?.id);
  const {
    createOrUpdate,
    isPending,
    removeAvatarMutation,
    updateAvatarMutation,
  } = useUsersMutation();

  const { createOrUpdate: createOrUpdateImage, isPending: isLoadingImage } =
    useImagesMutation();

  const { genderEnum, isLoadingGenderEnum } = useUserGenderEnum();
  const isCreateMode = !data?.id;
  const editingUserId = dataEdit?.id ?? data?.id;
  const canEditAvatar =
    isCreateMode ||
    (authUserId !== undefined &&
      editingUserId !== undefined &&
      Number(authUserId) === Number(editingUserId));

  const defaultValues = useMemo<IUser>(
    () => ({
      password: "",
      confirmPassword: "",
      ...(dataEdit ?? data),
    }),
    [data, dataEdit],
  );

  const form = useForm<IUser>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(UserSchema) as Resolver<IUser>,
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    const { confirmPassword: _confirmPassword, ...userData } = formData;
    const payload: IUser = {
      ...defaultValues,
      ...userData,
      id: dataEdit?.id ?? data?.id ?? userData.id,
    };

    delete payload.confirmPassword;

    const avatarContent = formData.avatarUrl ?? "";
    const previousAvatar = defaultValues.avatarUrl ?? "";
    const shouldRemoveAvatar =
      Boolean(payload.id) && Boolean(previousAvatar) && avatarContent === "";

    if (isImageDataUrl(avatarContent) && payload.id) {
      try {
        await updateAvatarMutation.mutateAsync({
          id: Number(payload.id),
          content: avatarContent,
        });
      } catch {
        return;
      }

      delete payload.avatarUrl;
    } else if (isImageDataUrl(avatarContent)) {
      try {
        const imagePayload = {
          type: "UserProfile" as const,
          name: `${payload.username ?? payload.nickname ?? "usuario"}-avatar`,
          content: avatarContent,
        };

        const imageResponse = await createOrUpdateImage(imagePayload);

        if (!imageResponse.url) {
          addToast("error", "Não foi possível identificar a URL da imagem.");
          return;
        }

        payload.avatarUrl = imageResponse.url;
      } catch {
        addToast("error", "Não foi possível enviar a imagem do usuário.");
        return;
      }
    } else if (payload.id) {
      delete payload.avatarUrl;
    }

    if (shouldRemoveAvatar && payload.id) {
      try {
        await removeAvatarMutation.mutateAsync(Number(payload.id));
      } catch {
        return;
      }
    }

    if (payload.id) {
      delete payload.password;
      delete payload.type;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.lastAccess;
    }

    createOrUpdate(payload);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FieldsWrapper>
        <InputGroup>
          <Label
            htmlFor="username"
            isRequired
            infoText="O nome de usuário será usado para login e identificação no sistema."
          >
            Nome de Usuário
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
          <Label
            htmlFor="nickname"
            isRequired
            infoText="O nickname é um apelido que pode ser usado para identificação em comunicações."
          >
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
          <Label
            htmlFor="email"
            isRequired
            infoText="O e-mail é necessário para comunicação e recuperação de conta. Deve ser único."
          >
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

      {isCreateMode ? (
        <FieldsWrapper>
          <InputGroup>
            <Label htmlFor="password" isRequired>
              Senha
            </Label>
            <ControlledPasswordInput
              hookForm={form}
              name="password"
              placeholder="Digite a senha"
              error={errors.password?.message}
              isLoading={isLoading}
              removeSpaces
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword" isRequired>
              Confirmar senha
            </Label>
            <ControlledPasswordInput
              hookForm={form}
              name="confirmPassword"
              placeholder="Confirme a senha"
              error={errors.confirmPassword?.message}
              isLoading={isLoading}
              removeSpaces
            />
          </InputGroup>
        </FieldsWrapper>
      ) : null}

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="birthDate" isRequired={isCreateMode}>
            Data de nascimento
          </Label>
          <DateInput
            hookForm={form}
            name="birthDate"
            placeholder="DD/MM/AAAA"
            error={errors.birthDate?.message}
            isLoading={isLoading}
            disabled={isPending || isLoadingImage}
            showYearDropdown
            maxDate={new Date()}
          />
        </InputGroup>

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
        <Label htmlFor="avatarUrl">Avatar</Label>
        <ControlledImageInput
          hookForm={form}
          name="avatarUrl"
          previewValue={toImageSource(dataEdit?.avatarUrl)}
          canChangeImage={canEditAvatar}
          disabled={isLoading || isPending || isLoadingImage}
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
