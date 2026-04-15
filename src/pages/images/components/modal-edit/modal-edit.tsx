import {
  Button,
  ControlledImageInput,
  ControlledInput,
  FieldsWrapper,
  InputGroup,
  Label,
  Select,
} from "@/src/components";
import { IMAGE_TYPE_OPTIONS } from "@/src/constants/select-options";
import { useImageById } from "@/src/features/images/hooks/use-image-by-id";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
import { type IImage } from "@/src/features/images/schemas/image.schema";
import { useBoundStore } from "@/src/store";
import { toImageSource } from "@/src/utils/image";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

export const ModalEdit = ({ data }: { data?: IImage }) => {
  const closeModal = useBoundStore((state) => state.closeModal);

  const { data: dataEdit, isLoading } = useImageById(data?.id);
  const { createMutation, updateMutation } = useImagesMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const defaultValues = useMemo<IImage>(() => {
    return {
      type: "CampaignBanner",
      name: "",
      content: "",
      ...(dataEdit ?? data),
    };
  }, [data, dataEdit]);

  const form = useForm<IImage>({
    defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = form;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit((values) => {
    const payload: IImage = {
      ...defaultValues,
      ...values,
    };

    if (payload.id) {
      updateMutation.mutate(payload);
      return;
    }

    createMutation.mutate(payload);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm text-grays-200">
        Configure os dados da imagem e selecione o arquivo abaixo.
      </p>

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="type" isRequired>
            Tipo
          </Label>
          <Select
            hookForm={form}
            name="type"
            initialOptions={IMAGE_TYPE_OPTIONS}
            title="Selecione o tipo"
            error={errors.type?.message}
            searchInput={false}
            disabled={isSubmitting || isLoading}
            isLoading={isSubmitting || isLoading}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="name" isRequired>
            Nome
          </Label>
          <ControlledInput
            hookForm={form}
            name="name"
            placeholder="Nome da imagem"
            error={errors.name?.message}
            isLoading={isSubmitting || isLoading}
          />
        </InputGroup>

        <InputGroup className="basis-full">
          <ControlledImageInput
            hookForm={form}
            name="content"
            label="Conteudo da imagem *"
            previewValue={toImageSource(dataEdit?.url)}
            disabled={isSubmitting || isLoading}
            error={errors.content?.message}
            onFileNameChange={(fileName) => {
              if (!form.getValues("name")) {
                setValue("name", fileName, { shouldDirty: true });
              }
            }}
          />
        </InputGroup>
      </FieldsWrapper>

      <div className="mt-6 flex justify-end gap-3">
        <Button buttonStyle="hollow" onClick={closeModal} type="button">
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!isDirty || isLoading || isSubmitting}
        >
          {data?.id ? "Salvar Alteracoes" : "Criar Imagem"}
        </Button>
      </div>
    </form>
  );
};
