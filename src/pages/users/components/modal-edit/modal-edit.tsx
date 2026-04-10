import {
  Button,
  ControlledImageInput,
  ControlledInput,
  InputGroup,
  Label,
  Select,
} from "@/src/components";
import { GENDER_OPTIONS } from "@/src/constants/select-options";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
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
    formState: { errors, isDirty },
  } = form;

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
      <p className="text-sm text-grays-200">
        Altere os dados do usuário abaixo.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InputGroup>
          <Label htmlFor="username" className="text-[11px] font-bold uppercase">
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
          <Label htmlFor="nickname" className="text-[11px] font-bold uppercase">
            Nickname
          </Label>
          <ControlledInput
            hookForm={form}
            name="nickname"
            placeholder="Digite o nickname"
            error={errors.nickname?.message}
            isLoading={isLoading}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="email" className="text-[11px] font-bold uppercase">
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

        <InputGroup>
          <Label htmlFor="gender" className="text-[11px] font-bold uppercase">
            Gênero
          </Label>
          <Select
            hookForm={form}
            name="gender"
            initialOptions={GENDER_OPTIONS}
            title="Selecione o gênero"
            error={errors.gender?.message}
            searchInput={false}
            disabled={isPending || isLoadingImage}
            isLoading={isPending || isLoadingImage}
          />
        </InputGroup>

        <InputGroup className="sm:col-span-2">
          <ControlledImageInput
            hookForm={form}
            name="avatarUrl"
            label="Avatar"
            previewValue={toImageSource(dataEdit?.avatarUrl)}
            disabled={isLoading || isPending || isLoadingImage}
          />
        </InputGroup>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button buttonStyle="hollow" onClick={closeModal} type="button">
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isPending || isLoadingImage}
          disabled={!isDirty || isPending || isLoadingImage}
        >
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
};
