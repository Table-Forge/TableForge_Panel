import { Button } from "@/src/components/button/button";
import { useBoundStore } from "@/src/store/use-bound-store";
import type { IModalDelete } from "./modal-delete.interface";

export function ModalDelete<TID extends number | string>({
  name,
  id,
  deleteMutation,
}: IModalDelete<TID>) {
  const closeModal = useBoundStore((state) => state.closeModal);

  return (
    <>
      <div className="flex w-full flex-col gap-2 p-4">
        <p className="text-sm text-white/90">
          Você tem certeza que deseja excluir <b>{name}</b>?
        </p>
      </div>

      <div className="flex w-full items-center justify-end gap-2">
        <Button type="button" onClick={closeModal}>
          Cancelar
        </Button>

        <Button
          type="button"
          onClick={() => deleteMutation.mutate(id)}
          buttonStyle="danger"
          isLoading={deleteMutation.isPending}
          disabled={deleteMutation.isPending}
        >
          Excluir
        </Button>
      </div>
    </>
  );
}
