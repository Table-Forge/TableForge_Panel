import { Button } from "@/src/components/button/button";
import { InfoBox, CardLabel, CardValue, GridBox } from "@/src/components/card-box/card-box";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { Label } from "@/src/components/label/label";
import { SpaceBookingStatus } from "@/src/features/spaces/components/space-booking-status";
import { useSpaceBookingMutations } from "@/src/features/spaces/hooks/use-spaces-mutations";
import {
  type ISpaceBooking,
  type ISpaceBookingStatusUpdate,
  SpaceBookingStatusSchema,
} from "@/src/features/spaces/schemas/spaces.schema";
import { useBoundStore } from "@/src/store";
import { formatDate } from "@/src/utils/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { ChatBox } from "../chat-box/chat-box";

interface IProps {
  booking: ISpaceBooking;
}

export function ModalBookingDetails({ booking }: IProps) {
  const closeModal = useBoundStore((state) => state.closeModal);
  const { updateStatusMutation } = useSpaceBookingMutations();

  const isPending = updateStatusMutation.isPending;

  const form = useForm<ISpaceBookingStatusUpdate>({
    defaultValues: {
      status: "",
      statusReason: "",
    },
    resolver: zodResolver(SpaceBookingStatusSchema) as Resolver<ISpaceBookingStatusUpdate>,
  });

  const { handleSubmit, setValue, formState: { errors } } = form;



  const handleStatusAction = (status: string) => {
    setValue("status", status);
    handleSubmit((data) => {
      updateStatusMutation.mutate(
        { id: booking.id, data },
        {
          onSuccess: () => closeModal(),
        }
      );
    })();
  };

  const isPendingStatus = booking.status === "Pending";

  return (
    <div className="flex flex-col gap-6">
      <GridBox>
        <InfoBox>
          <CardLabel>Status</CardLabel>
          <div className="mt-1">
            <SpaceBookingStatus value={booking.status} />
          </div>
        </InfoBox>
        <InfoBox>
          <CardLabel>Cliente</CardLabel>
          <CardValue className="mt-1">
            {booking.userName || `Usuário #${booking.userId}`}
          </CardValue>
        </InfoBox>
        <InfoBox>
          <CardLabel>Data da Reserva</CardLabel>
          <CardValue className="mt-1">
            {formatDate(booking.bookingDate)}
          </CardValue>
        </InfoBox>
        <InfoBox>
          <CardLabel>Horário</CardLabel>
          <CardValue className="mt-1">
            {booking.startTime} - {booking.endTime}
          </CardValue>
        </InfoBox>
        <InfoBox>
          <CardLabel>Jogadores</CardLabel>
          <CardValue className="mt-1">
            {booking.playerCount}
          </CardValue>
        </InfoBox>
        <InfoBox>
          <CardLabel>ID da Mesa</CardLabel>
          <CardValue className="mt-1">
            {booking.spaceTableId}
          </CardValue>
        </InfoBox>
      </GridBox>

      {booking.intendedGames && (
        <InfoBox>
          <CardLabel>Jogos Pretendidos</CardLabel>
          <CardValue className="mt-1 whitespace-pre-wrap">
            {booking.intendedGames}
          </CardValue>
        </InfoBox>
      )}

      {booking.notes && (
        <InfoBox>
          <CardLabel>Observações do Cliente</CardLabel>
          <CardValue className="mt-1 whitespace-pre-wrap">
            {booking.notes}
          </CardValue>
        </InfoBox>
      )}

      {booking.statusReason && (
        <div className="rounded-md bg-secondary/50 p-3 border border-secondary">
          <CardLabel>Motivo do Status</CardLabel>
          <CardValue className="mt-1 text-white">
            {booking.statusReason}
          </CardValue>
        </div>
      )}

      {isPendingStatus && (
        <form className="mt-4 border-t border-white/10 pt-4 flex flex-col gap-4">
          <div>
            <Label htmlFor="statusReason">
              Motivo (opcional para Aprovar, recomendado para Recusar)
            </Label>
            <ControlledInput
              hookForm={form}
              name="statusReason"
              placeholder="Ex: Mesa não disponível nesse horário"
              error={errors.statusReason?.message}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              buttonStyle="danger" 
              onClick={() => handleStatusAction("Rejected")}
              isLoading={isPending}
              disabled={isPending}
            >
              Recusar Pedido
            </Button>
            <Button 
              type="button" 
              buttonStyle="primary" 
              onClick={() => handleStatusAction("Approved")}
              isLoading={isPending}
              disabled={isPending}
            >
              Aprovar Pedido
            </Button>
          </div>
        </form>
      )}

      {!isPendingStatus && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <CardLabel className="mb-3">Chat com o Cliente</CardLabel>
          <ChatBox bookingId={booking.id} />
        </div>
      )}

      <div className="flex justify-end gap-3 mt-4">
        <Button buttonStyle="hollow" onClick={closeModal} type="button">
          Fechar
        </Button>
      </div>
    </div>
  );
}
