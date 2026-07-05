import { Button } from "@/src/components/button/button";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { CheckboxControlled } from "@/src/components/checkbox/checkbox-controlled";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import { useImageTypeEnum } from "@/src/features/images/hooks/enums/use-image-type-enum";
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
  const { imageTypeEnum, isLoadingImageTypeEnum } = useImageTypeEnum();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const defaultValues = useMemo<IImage>(
    () => ({
      type: 1,
      name: "",
      content: "",
      optimize: true,
      ...(dataEdit ?? data),
    }),
    [data, dataEdit],
  );

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
    const { userId: _userId, campaignId: _campaignId, ...imageValues } = values;
    const payload: IImage = {
      ...defaultValues,
      ...imageValues,
      userId: undefined,
      campaignId: undefined,
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
            initialOptions={imageTypeEnum}
            title="Selecione o tipo"
            error={errors.type?.message}
            searchInput={false}
            disabled={isSubmitting || isLoading || isLoadingImageTypeEnum}
            isLoading={isSubmitting || isLoading || isLoadingImageTypeEnum}
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
          <Label htmlFor="content" isRequired>
            Conteúdo da imagem
          </Label>
          <ControlledImageInput
            hookForm={form}
            name="content"
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

        <InputGroup className="basis-full">
          <CheckboxControlled
            hookForm={form}
            name="optimize"
            label="Otimizar imagem automaticamente"
            infoText="Quando ativado, a imagem será convertida para WebP e comprimida (padrão 80%). Desative apenas para imagens que requerem preservação exata, como logos de alta resolução ou sprites com fundo transparente que perdem qualidade na conversão."
            disabled={isSubmitting || isLoading}
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
          {data?.id ? "Salvar alterações" : "Criar imagem"}
        </Button>
      </div>
    </form>
  );
};
