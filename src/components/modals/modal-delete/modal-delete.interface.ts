import type { UseMutationResult } from "@tanstack/react-query";

interface IModalDelete<TID extends number | string, TData = unknown, TError = unknown> {
  name: string;
  id: TID;
  deleteMutation: UseMutationResult<TData, TError, TID, unknown>;
  customMessage?: string;
}

export type { IModalDelete };
