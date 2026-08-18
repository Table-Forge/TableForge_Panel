import { Button } from "@/src/components/button/button";
import { useBoundStore } from "@/src/store/use-bound-store";
import { useState } from "react";
import type { IModalDelete } from "./modal-delete.interface";

export function ModalDelete<TID extends number | string, TData = unknown, TError = unknown>({
  name,
  id,
  deleteMutation,
  customMessage,
}: IModalDelete<TID, TData, TError>) {
  const closeModal = useBoundStore((state) => state.closeModal);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    deleteMutation.mutate(id, {
      onSettled: () => setIsDeleting(false),
    });
  };

  return (
    <>
      <div className="flex w-full flex-col gap-2 p-4">
        <p className="text-sm text-white/90">
          {customMessage ? (
            customMessage
          ) : (
            <>
              Você tem certeza que deseja excluir <b>{name}</b>?
            </>
          )}
        </p>
      </div>

      <div className="flex w-full items-center justify-end gap-2">
        <Button type="button" onClick={closeModal} disabled={isDeleting}>
          Cancelar
        </Button>

        <Button
          type="button"
          onClick={handleDelete}
          buttonStyle="danger"
          isLoading={isDeleting}
          disabled={isDeleting}
        >
          Excluir
        </Button>
      </div>
    </>
  );
}
