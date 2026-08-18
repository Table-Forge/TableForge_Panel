import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { Button } from "@/src/components/button/button";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { ControlledMaskedInput } from "@/src/components/input/input.masked.controlled";
import { Label } from "@/src/components/label/label";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
import {
  type ISpace,
  type ISpaceList,
  type ISpaceCreate,
  SpaceCreateSchema,
} from "@/src/features/spaces/schemas/spaces.schema";
import { useSpaceMutations } from "@/src/features/spaces/hooks/use-spaces-mutations";
import { useBoundStore } from "@/src/store";
import {
  MAX_AVATAR_SIZE_BYTES,
  isImageDataUrl,
  toImageSource,
} from "@/src/utils/image";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

// Define an interface for the form that extends ISpaceCreate with the current bannerUrl to display the image
interface ISpaceForm extends ISpaceCreate {
  id?: number;
  bannerUrl?: string;
}

export const ModalEditSpace = ({ data }: { data?: ISpaceList | ISpace }) => {
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);

  const { createSpaceMutation, updateSpaceMutation } = useSpaceMutations();

  const isPending = createSpaceMutation.isPending || updateSpaceMutation.isPending;

  const { createOrUpdate: createOrUpdateImage, isPending: isLoadingImage } =
    useImagesMutation();

  const defaultValues = useMemo<ISpaceForm>(
    () => ({
      name: data?.name ?? "",
      description: data?.description ?? "",
      address: data?.address ?? "",
      latitude: data?.latitude ?? 0,
      longitude: data?.longitude ?? 0,
      phoneNumber: data?.phoneNumber ?? "",
      openTime: data?.openTime ?? "",
      closeTime: data?.closeTime ?? "",
      workingDays: data?.workingDays ?? "",
      status: data?.status ?? "Active",
      bannerUrl: data?.bannerUrl ?? "",
      id: data?.id,
    }),
    [data]
  );

  const form = useForm<ISpaceForm>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(SpaceCreateSchema) as Resolver<ISpaceForm>,
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
    const payload: ISpaceCreate = {
      name: formData.name,
      description: formData.description,
      address: formData.address,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      phoneNumber: formData.phoneNumber?.replace(/\D/g, ""),
      openTime: formData.openTime || undefined,
      closeTime: formData.closeTime || undefined,
      workingDays: formData.workingDays,
      status: formData.status,
    };

    const bannerContent = formData.bannerUrl ?? "";

    if (isImageDataUrl(bannerContent)) {
      try {
        const imagePayload = {
          type: 4, // 4 = Space Banner? Let's check ENUM later, but we can pass type 1 or generic
          name: `${payload.name}-banner`,
          content: bannerContent,
        };

        const imageResponse = await createOrUpdateImage(imagePayload);

        if (!imageResponse.id) {
          addToast("error", "Não foi possível identificar a ID da imagem.");
          return;
        }

        payload.bannerId = imageResponse.id;
      } catch {
        addToast("error", "Não foi possível enviar o banner do espaço.");
        return;
      }
    }

    if (data?.id) {
      updateSpaceMutation.mutate({ id: data.id, data: payload });
    } else {
      createSpaceMutation.mutate(payload);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto px-1 pb-1">
      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="name" isRequired>
            Nome do Espaço
          </Label>
          <ControlledInput
            hookForm={form}
            name="name"
            placeholder="Digite o nome"
            error={errors.name?.message}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="phoneNumber">Telefone</Label>
          <ControlledMaskedInput
            hookForm={form}
            name="phoneNumber"
            mask="(99) 99999-9999"
            placeholder="(00) 00000-0000"
            error={errors.phoneNumber?.message}
          />
        </InputGroup>
      </FieldsWrapper>

      <InputGroup>
        <Label htmlFor="description" isRequired>
          Descrição
        </Label>
        <ControlledInput
          hookForm={form}
          name="description"
          placeholder="Descrição do espaço"
          error={errors.description?.message}
        />
      </InputGroup>

      <FieldsWrapper>
        <InputGroup className="col-span-2">
          <Label htmlFor="address" isRequired>
            Endereço Completo
          </Label>
          <ControlledInput
            hookForm={form}
            name="address"
            placeholder="Ex: Rua X, 123"
            error={errors.address?.message}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="latitude" isRequired>
            Latitude
          </Label>
          <ControlledInput
            hookForm={form}
            name="latitude"
            placeholder="-00.0000"
            error={errors.latitude?.message}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="longitude" isRequired>
            Longitude
          </Label>
          <ControlledInput
            hookForm={form}
            name="longitude"
            placeholder="-00.0000"
            error={errors.longitude?.message}
          />
        </InputGroup>
      </FieldsWrapper>

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="workingDays">Dias de Funcionamento</Label>
          <ControlledInput
            hookForm={form}
            name="workingDays"
            placeholder="Ex: Mon,Tue,Wed"
            error={errors.workingDays?.message}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="openTime">Abertura (HH:MM)</Label>
          <ControlledMaskedInput
            hookForm={form}
            name="openTime"
            mask="99:99"
            placeholder="00:00"
            error={errors.openTime?.message}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="closeTime">Fechamento (HH:MM)</Label>
          <ControlledMaskedInput
            hookForm={form}
            name="closeTime"
            mask="99:99"
            placeholder="00:00"
            error={errors.closeTime?.message}
          />
        </InputGroup>
      </FieldsWrapper>

      <InputGroup className="basis-full">
        <Label htmlFor="bannerUrl">Banner do Espaço</Label>
        <ControlledImageInput
          hookForm={form}
          name="bannerUrl"
          previewValue={toImageSource(data?.bannerUrl)}
          canChangeImage={true}
          maxSizeBytes={MAX_AVATAR_SIZE_BYTES} // Adjust if banner allows larger sizes
          disabled={isPending || isLoadingImage}
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
          {data?.id ? "Salvar alterações" : "Criar Espaço"}
        </Button>
      </div>
    </form>
  );
};
