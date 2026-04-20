/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IError } from "@/src/interfaces/error.interface";
import { useBoundStore } from "@/src/store/use-bound-store";

const isHtml = (val: any) =>
  typeof val === "string" &&
  (val.startsWith("<!DOCTYPE") || val.startsWith("<html"));

const HTML_ERROR_MESSAGE =
  "HTML retornado, verifique os logs para mais informações.";

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
};

const getBackendPayload = (error: any) => {
  if (!error || typeof error !== "object") return undefined;
  return error.response?.data ?? error.data ?? error;
};

const getStatusCode = (error: any, payload: any) =>
  error?.response?.status ??
  error?.status ??
  payload?.Code ??
  payload?.code ??
  500;

export const handleError = (error: unknown): IError => {
  let finalError: IError = {
    status: 500,
    code: "UNKNOWN_ERROR",
    message: "Ocorreu um erro inesperado",
    title: "Erro",
  };

  if (error instanceof Error) {
    const err = error as any;
    const payload = getBackendPayload(err);
    const hasHtml = isHtml(payload);

    finalError = {
      status: getStatusCode(err, payload),
      code: err?.code || payload?.Code || payload?.code || "ERROR",
      message: hasHtml
        ? HTML_ERROR_MESSAGE
        : pickString(payload?.Message, payload?.message, err?.Message, err?.message) ||
          "Erro processado pelo servidor",
      stackTrace: err.stack,
      title:
        pickString(payload?.Title, payload?.title, err?.name) ||
        "Erro de Execução",
    };
  } else if (typeof error === "string") {
    finalError.message = isHtml(error) ? HTML_ERROR_MESSAGE : error;
  } else if (typeof error === "object" && error !== null) {
    const err = error as any;
    const payload = getBackendPayload(err);
    const hasHtml = isHtml(payload);

    finalError = {
      status: getStatusCode(err, payload),
      code: err.code || payload?.Code || payload?.code || "BACKEND_ERROR",
      message: hasHtml
        ? HTML_ERROR_MESSAGE
        : pickString(payload?.Message, payload?.message, err.Message, err.message) ||
          "Erro processado pelo servidor",
      title: pickString(payload?.Title, payload?.title) || "Aviso do Sistema",
    };
  }

  const { addToast } = useBoundStore.getState();
  addToast("error", finalError.message || "Ocorreu um erro inesperado");

  return finalError;
};
