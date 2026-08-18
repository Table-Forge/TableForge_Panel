import type { TModalSize } from "@/src/components/modals/modal.interface";
import type {
  IToast,
  ToastType,
} from "@/src/components/toast/toast.interfaces";
import type { ILoginResponse } from "@/src/features/auth/schemas/auth.schema";
import type { ReactNode } from "react";
import type { StateCreator } from "zustand";

export interface AuthSlice {
  authData: ILoginResponse | null;
  isLoading: boolean;
  hydrateAuth: () => void;
  signIn: (data: ILoginResponse) => void;
  signOut: () => void;
}

export interface ToastSlice {
  toasts: IToast[];
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: number) => void;
  clearToasts: () => void;
}

export type ModalSize = TModalSize;

export interface IOpenModalPayload {
  title?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
}

export interface IModalState {
  id?: string;
  isOpen: boolean;
  title?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  size: ModalSize;
}

export interface IModalInstance {
  id: string;
  isOpen: boolean;
  title?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  size: ModalSize;
}

export interface ModalSlice {
  modal: IModalState;
  modals: IModalInstance[];
  openModal: {
    (payload: IOpenModalPayload): void;
    (title: ReactNode, content: ReactNode, size?: ModalSize, footer?: ReactNode): void;
  };
  closeModal: () => void;
}

export type BoundStore = AuthSlice & ToastSlice & ModalSlice;
export type SliceCreator<TSlice> = StateCreator<BoundStore, [], [], TSlice>;
