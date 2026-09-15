import { useState } from "react";
import { Button } from "@/src/components/button/button";
import { ModalFooter } from "@/src/components/modals/modal-footer";
import { useBoundStore } from "@/src/store/use-bound-store";

interface ModalActionConfirmProps {
  description: string;
  confirmLabel: string;
  buttonStyle?: "primary" | "secondary" | "danger";
  onConfirm: () => void | Promise<unknown>;
  isLoading?: boolean;
}

export function ModalActionConfirm({
  description,
  confirmLabel,
  buttonStyle = "secondary",
  onConfirm,
  isLoading: externalLoading,
}: ModalActionConfirmProps) {
  const closeModal = useBoundStore((state) => state.closeModal);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
    } catch {
      setIsSubmitting(false);
    }
  };

  const loading = externalLoading || isSubmitting;

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
          disabled={loading}
        >
          Cancelar
        </Button>

        <Button
          type="button"
          onClick={handleConfirm}
          buttonStyle={buttonStyle}
          isLoading={loading}
          disabled={loading}
        >
          {confirmLabel}
        </Button>
      </ModalFooter>
    </>
  );
}
