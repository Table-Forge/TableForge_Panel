/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IError } from "@/src/interfaces/error.interface";
import { useBoundStore } from "@/src/store/use-bound-store";

const isHtml = (val: any) =>
  typeof val === "string" &&
  (val.startsWith("<!DOCTYPE") || val.startsWith("<html"));

export const handleError = (error: unknown): IError => {
  let finalError: IError = {
    status: 500,
    code: "UNKNOWN_ERROR",
    message: "Ocorreu um erro inesperado",
    title: "Erro",
  };

  if (error instanceof Error) {
    finalError = {
      status: (error as any).status || 500,
      code: (error as any).code || "ERROR",
      message: error.message,
      stackTrace: error.stack,
      title: error.name || "Erro de Execução",
    };
  } else if (typeof error === "string") {
    finalError.message = isHtml(error)
      ? "Erro inesperado no servidor (resposta HTML)"
      : error;
  } else if (typeof error === "object" && error !== null) {
    const err = error as any;
    const rawData = err.data || err.Message || err;
    const hasHtml = isHtml(rawData);

    finalError = {
      status: err.status || 400,
      code: err.code || "BACKEND_ERROR",
      message: hasHtml
        ? "Erro inesperado no servidor (HTML retornado)"
        : err.Message || err.message || "Erro processado pelo servidor",
      title: "Aviso do Sistema",
    };
  }

  const { addToast } = useBoundStore.getState();
  addToast("error", finalError.message || "Ocorreu um erro inesperado");

  return finalError;
};
