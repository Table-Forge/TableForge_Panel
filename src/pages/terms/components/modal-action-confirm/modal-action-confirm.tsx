import { Button } from "@/src/components/button/button";
import { ModalFooter } from "@/src/components/modals/modal-footer";
import { useBoundStore } from "@/src/store/use-bound-store";

interface ModalActionConfirmProps {
  description: string;
  confirmLabel: string;
  buttonStyle?: "primary" | "secondary" | "danger";
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ModalActionConfirm({
  description,
  confirmLabel,
  buttonStyle = "secondary",
  onConfirm,
  isLoading,
}: ModalActionConfirmProps) {
  const closeModal = useBoundStore((state) => state.closeModal);

  return (
    <>
      <div className="flex w-full flex-col gap-3 py-2">
        <p className="text-sm leading-relaxed text-white/90">{description}</p>
      </div>

      <ModalFooter>
        <Button
          type="button"
          buttonStyle="hollow"
          onClick={closeModal}
          disabled={isLoading}
        >
          Cancelar
        </Button>

        <Button
          type="button"
          onClick={onConfirm}
          buttonStyle={buttonStyle}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {confirmLabel}
        </Button>
      </ModalFooter>
    </>
  );
}
