import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/src/components/button/button";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { Label } from "@/src/components/label/label";
import { ModalFooter } from "@/src/components/modals/modal-footer";
import { Select } from "@/src/components/select/select";
import { ControlledTextarea } from "@/src/components/input/input.textarea.controlled";
import { useUserFeedbackStatusEnum } from "@/src/features/user-feedbacks/hooks/enums/use-user-feedback-enums";
import { useUserFeedbacksMutations } from "@/src/features/user-feedbacks/hooks/use-user-feedbacks-mutations";
import type { IUserFeedback } from "@/src/features/user-feedbacks/interfaces";
import {
  UserFeedbackStatusUpdateSchema,
  type IUserFeedbackStatusUpdate,
} from "@/src/features/user-feedbacks/schemas/user-feedback.schema";
import { useBoundStore } from "@/src/store";
import { handleError } from "@/src/utils/error-handler";

interface IModalTriageProps {
  feedback: IUserFeedback;
}

export function ModalTriage({ feedback }: IModalTriageProps) {
  const closeModal = useBoundStore((state) => state.closeModal);
  const addToast = useBoundStore((state) => state.addToast);

  const { statusEnum, isLoadingStatusEnum } = useUserFeedbackStatusEnum();
  const { updateStatusMutation, isUpdatingStatus } = useUserFeedbacksMutations();

  const hookForm = useForm<IUserFeedbackStatusUpdate>({
    resolver: zodResolver(UserFeedbackStatusUpdateSchema),
    defaultValues: {
      status: feedback.status,
      priority: feedback.priority,
      response: feedback.adminResponse || "",
    },
  });

  useEffect(() => {
    hookForm.reset({
      status: feedback.status,
      priority: feedback.priority,
      response: feedback.adminResponse || "",
    });
  }, [feedback, hookForm]);

  const onSubmit = async (data: IUserFeedbackStatusUpdate) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: feedback.id,
        payload: data,
      });
      addToast("success", "Situação do feedback atualizada com sucesso!");
      closeModal();
    } catch (error: unknown) {
      handleError(error);
    }
  };

  return (
    <form onSubmit={hookForm.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldsWrapper>
        <InputGroup>
          <Label htmlFor="status" isRequired>
            Situação
          </Label>
          <Select
            hookForm={hookForm}
            name="status"
            initialOptions={statusEnum}
            isLoading={isLoadingStatusEnum}
            title="Selecione a situação"
          />
        </InputGroup>
      </FieldsWrapper>

      <InputGroup>
        <Label htmlFor="response">
          Resposta / Motivo (enviada automaticamente para o usuário)
        </Label>
        <ControlledTextarea
          hookForm={hookForm}
          name="response"
          placeholder="Escreva a resposta oficial ao mudar a situação..."
          rows={4}
          maxLength={2000}
        />
      </InputGroup>

      <ModalFooter>
        <Button
          type="button"
          buttonStyle="hollow"
          onClick={closeModal}
          disabled={isUpdatingStatus}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          buttonStyle="primary"
          isLoading={isUpdatingStatus}
        >
          Salvar Situação
        </Button>
      </ModalFooter>
    </form>
  );
}
