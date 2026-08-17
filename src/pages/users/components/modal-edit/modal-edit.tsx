import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { Button } from "@/src/components/button/button";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { DateInput } from "@/src/components/input/input.date.controlled";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { ControlledMaskedInput } from "@/src/components/input/input.masked.controlled";
import { PasswordInput } from "@/src/components/input/input.password";
import { PasswordRequirements } from "@/src/components/input/password-requirements";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
import { useUserGenderEnum } from "@/src/features/users/hooks/enums/use-user-gender-enum";
import { useUserTypeEnum } from "@/src/features/users/hooks/enums/use-user-type-enum";
import { useDocumentTypeEnum } from "@/src/features/users/hooks/enums/use-document-type-enum";
import { useUserById } from "@/src/features/users/hooks/use-user-by-id";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
import { type IUser, UserSchema } from "@/src/features/users/schemas/user.schema";
import { useBoundStore } from "@/src/store";
import {
  MAX_AVATAR_SIZE_BYTES,
  isImageDataUrl,
  toImageSource,
} from "@/src/utils/image";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

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
  const { typeEnum, isLoadingTypeEnum } = useUserTypeEnum();
  const { documentTypeEnum, isLoadingDocumentTypeEnum } = useDocumentTypeEnum();
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
    control,
    formState: { errors, isDirty },
    watch,
  } = form;

  const passwordValue = useWatch({ control, name: "password" });
  const selectedType = watch("type");
  const selectedDocType = watch("documentType");

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
          type: 2,
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

    if (payload.type === "Organizer" || selectedType === "Organizer") {
      if (payload.document) payload.document = payload.document.replace(/\D/g, "");
      if (payload.phoneNumber) payload.phoneNumber = payload.phoneNumber.replace(/\D/g, "");
      if (payload.documentType !== "CNPJ") delete payload.companyName;
    } else {
      delete payload.document;
      delete payload.documentType;
      delete payload.phoneNumber;
      delete payload.companyName;
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
          <InputGroup className="relative group">
            <Label htmlFor="password" isRequired>
              Senha
            </Label>
            <PasswordInput
              hookForm={form}
              name="password"
              placeholder="Digite a senha"
              error={errors.password?.message}
              isLoading={isLoading}
            />
            <PasswordRequirements value={passwordValue} />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword" isRequired>
              Confirmar senha
            </Label>
            <PasswordInput
              hookForm={form}
              name="confirmPassword"
              placeholder="Confirme a senha"
              error={errors.confirmPassword?.message}
              isLoading={isLoading}
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
            initialOptions={typeEnum}
            title="Selecione o tipo"
            error={errors.type?.message}
            searchInput={false}
            disabled={
              !isCreateMode ||
              isPending ||
              isLoadingImage ||
              isLoading ||
              isLoadingTypeEnum
            }
            isLoading={isLoadingTypeEnum}
          />
        </InputGroup>
      </FieldsWrapper>

      {selectedType === "Organizer" && (
        <FieldsWrapper>
          <InputGroup>
            <Label htmlFor="documentType" isRequired>
              Tipo de Documento
            </Label>
            <Select
              hookForm={form}
              name="documentType"
              initialOptions={documentTypeEnum}
              title="Selecione o tipo"
              error={errors.documentType?.message}
              searchInput={false}
              disabled={isLoadingDocumentTypeEnum}
              isLoading={isLoadingDocumentTypeEnum}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="document" isRequired>
              Documento
            </Label>
            <ControlledMaskedInput
              hookForm={form}
              name="document"
              mask={selectedDocType === "CNPJ" ? "99.999.999/9999-99" : "999.999.999-99"}
              placeholder={selectedDocType === "CNPJ" ? "00.000.000/0000-00" : "000.000.000-00"}
              error={errors.document?.message}
              isLoading={isLoading}
              disabled={!selectedDocType}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="phoneNumber" isRequired>
              Telefone
            </Label>
            <ControlledMaskedInput
              hookForm={form}
              name="phoneNumber"
              mask="(99) 99999-9999"
              placeholder="(00) 00000-0000"
              error={errors.phoneNumber?.message}
              isLoading={isLoading}
            />
          </InputGroup>

          {selectedDocType === "CNPJ" && (
            <InputGroup>
              <Label htmlFor="companyName" isRequired>
                Razão Social / Empresa
              </Label>
              <ControlledInput
                hookForm={form}
                name="companyName"
                placeholder="Nome da empresa"
                error={errors.companyName?.message}
                isLoading={isLoading}
              />
            </InputGroup>
          )}
        </FieldsWrapper>
      )}

      <InputGroup className="basis-full">
        <Label htmlFor="avatarUrl">Avatar</Label>
        <ControlledImageInput
          hookForm={form}
          name="avatarUrl"
          previewValue={toImageSource(dataEdit?.avatarUrl)}
          canChangeImage={canEditAvatar}
          maxSizeBytes={MAX_AVATAR_SIZE_BYTES}
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
