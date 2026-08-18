import { Button } from "@/src/components/button/button";
import { CheckboxControlled } from "@/src/components/checkbox/checkbox-controlled";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { ControlledTextarea } from "@/src/components/input/input.textarea.controlled";
import { Label } from "@/src/components/label/label";
import { ControlledLocationAutocomplete } from "@/src/components/location-autocomplete/location-autocomplete.controlled";
import { Select } from "@/src/components/select/select";
import { useEventStatusEnum } from "@/src/features/events/hooks/enums/use-event-status-enum";
import { useEventMutations } from "@/src/features/events/hooks/use-events-mutations";
import { eventCreateSchema, type IEventCreate, type IEvent } from "@/src/features/events/schemas/events.schema";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
import { isImageDataUrl, toImageSource } from "@/src/utils/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { useBoundStore } from "@/src/store";

type IEventForm = IEventCreate & { bannerContent?: string };

export const EventForm = ({ data }: { data?: IEvent }) => {
  const { createMutation, updateMutation } = useEventMutations();
  const { createOrUpdate: createOrUpdateImage, isPending: isLoadingImage } = useImagesMutation();
  const { data: eventStatusEnum, isLoading: isLoadingStatus } = useEventStatusEnum();
  const addToast = useBoundStore((state) => state.addToast);

  const defaultValues = useMemo<IEventForm>(
    () => ({
      title: data?.title || "",
      description: data?.description || "",
      startDate: data?.startDate || "",
      endDate: data?.endDate || "",
      isOnline: data?.isOnline ?? false,
      spaceId: undefined, // Ignorado no MVP de Panel
      locationName: data?.locationName || "",
      address: data?.address || "",
      latitude: data?.latitude,
      longitude: data?.longitude,
      maxAttendees: data?.maxAttendees,
      entryFee: data?.entryFee,
      tags: data?.tags || "",
      bannerId: undefined, // ID de update se já tivermos um
      status: data?.status || "Draft",
      bannerContent: "",
    }),
    [data]
  );

  const form = useForm<IEventForm>({
    resolver: zodResolver(eventCreateSchema) as Resolver<IEventForm>,
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

  const isOnlineWatch = useWatch({ control, name: "isOnline" });
  const currentBannerContent = useWatch({ control, name: "bannerContent" });

  const selectedBannerSource = toImageSource(
    currentBannerContent || (data?.bannerUrl)
  );

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (isOnlineWatch) {
      setValue("locationName", undefined);
      setValue("address", undefined);
      setValue("latitude", undefined);
      setValue("longitude", undefined);
      setValue("spaceId", undefined);
    }
  }, [isOnlineWatch, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    if (data?.id && values.maxAttendees) {
      const confirmed = data.confirmedAttendeesCount || 0;
      if (values.maxAttendees < confirmed) {
        addToast(
          "error",
          `O evento já possui ${confirmed} participante(s) confirmado(s). O limite não pode ser menor que esse total!`
        );
        return;
      }
    }

    if (!values.isOnline && !values.locationName?.trim() && !values.address?.trim()) {
      addToast(
        "error",
        "Eventos presenciais requerem a definição de um Local/Endereço."
      );
      return;
    }

    const { bannerContent: _bannerContent, ...eventValues } = values;
    let bannerId: number | undefined = undefined;

    if (isImageDataUrl(_bannerContent)) {
      try {
        const imagePayload = {
          type: 7, // EventBanner
          name: `${eventValues.title || "evento"}-banner`,
          content: _bannerContent ?? "",
        };

        const imageResponse = await createOrUpdateImage(imagePayload);
        if (imageResponse.id) {
          bannerId = Number(imageResponse.id);
        }
      } catch {
        addToast("error", "Não foi possível enviar o banner do evento.");
        return;
      }
    }

    const payload = { ...eventValues, bannerId };

    if (data?.id) {
      updateMutation.mutate({ id: data.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending || isLoadingImage;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="title" isRequired>Título</Label>
          <ControlledInput
            hookForm={form}
            name="title"
            placeholder="Digite o título do evento"
            error={errors.title?.message as string | undefined}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="status" isRequired>Status</Label>
          <Select
            hookForm={form}
            name="status"
            initialOptions={eventStatusEnum ?? []}
            title="Selecione o status"
            error={errors.status?.message as string | undefined}
            searchInput={false}
            disabled={isLoadingStatus}
            isLoading={isLoadingStatus}
          />
        </InputGroup>
      </FieldsWrapper>

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="startDate" isRequired>Data e Hora de Início</Label>
          <ControlledInput
            hookForm={form}
            name="startDate"
            type="datetime-local"
            error={errors.startDate?.message as string | undefined}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="endDate">Data e Hora de Término</Label>
          <ControlledInput
            hookForm={form}
            name="endDate"
            type="datetime-local"
            error={errors.endDate?.message as string | undefined}
          />
        </InputGroup>
      </FieldsWrapper>

      <FieldsWrapper>
        <CheckboxControlled
          hookForm={form}
          name="isOnline"
          label="Evento Online"
          disabled={isSubmitting}
        />
      </FieldsWrapper>

      {!isOnlineWatch && (
        <FieldsWrapper>
          <InputGroup className="basis-full">
            <Label htmlFor="locationName" isRequired>Localização</Label>
            <ControlledLocationAutocomplete
              hookForm={form}
              name="locationName"
              hasSelectionError={false}
              isSelectionValid={true}
              disabled={isSubmitting}
              onClearSelection={() => {
                setValue("address", undefined, { shouldValidate: false });
                setValue("latitude", undefined, { shouldValidate: false });
                setValue("longitude", undefined, { shouldValidate: false });
              }}
              onSelectLocation={(location) => {
                setValue("address", location.address, { shouldValidate: true });
                setValue("latitude", location.latitude, { shouldValidate: true });
                setValue("longitude", location.longitude, { shouldValidate: true });
              }}
            />
          </InputGroup>
        </FieldsWrapper>
      )}

      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="maxAttendees">Limite de Vagas</Label>
          <ControlledInput
            hookForm={form}
            name="maxAttendees"
            type="number"
            min={0}
            step={1}
            placeholder="Ilimitado"
            error={errors.maxAttendees?.message as string | undefined}
            disabled={isSubmitting}
          />
          {data?.id && (
            <p className="text-xs text-grays-100 mt-1">
              Participantes confirmados atualmente: {data.confirmedAttendeesCount || 0}
            </p>
          )}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="entryFee">Valor (R$)</Label>
          <ControlledInput
            hookForm={form}
            name="entryFee"
            type="number"
            min={0}
            step={0.01}
            placeholder="Gratuito"
            error={errors.entryFee?.message as string | undefined}
            disabled={isSubmitting}
          />
        </InputGroup>
      </FieldsWrapper>

      <FieldsWrapper>
        <InputGroup className="basis-full">
          <Label htmlFor="tags">Temáticas (Tags)</Label>
          <ControlledInput
            hookForm={form}
            name="tags"
            placeholder="Ex: RPG, Anime, Cardgame (separados por vírgula)"
            error={errors.tags?.message as string | undefined}
          />
        </InputGroup>
      </FieldsWrapper>

      <InputGroup className="basis-full">
        <Label htmlFor="description">Descrição</Label>
        <ControlledTextarea
          hookForm={form}
          name="description"
          placeholder="Descrição do evento"
          error={errors.description?.message as string | undefined}
          maxLength={1000}
        />
      </InputGroup>

      <InputGroup className="basis-full">
        <Label htmlFor="bannerContent">Capa do Evento</Label>
        <ControlledImageInput
          hookForm={form}
          name="bannerContent"
          previewValue={selectedBannerSource}
          disabled={isSubmitting}
          onClearImage={() => {
            setValue("bannerId", undefined);
          }}
        />
      </InputGroup>

      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-cream/10">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!isDirty || isSubmitting}
        >
          {data?.id ? "Salvar alterações" : "Criar evento"}
        </Button>
      </div>
    </form>
  );
};
