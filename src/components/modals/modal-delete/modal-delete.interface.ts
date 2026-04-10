import type { UseMutationResult } from "@tanstack/react-query";

interface IModalDelete<TID extends number | string> {
  name: string;
  id: TID;
  deleteMutation: UseMutationResult<unknown, Error, TID, unknown>;
}

export type { IModalDelete };
