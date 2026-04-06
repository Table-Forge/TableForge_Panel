import type { ReactNode } from "react";
import type { StateCreator } from "zustand";
import type { ILoginResponse } from "@/src/features/users/schemas/auth.schema";
import type { IToast, ToastType } from "@/src/components/toast/toast.interfaces";

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

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface IModalState {
  isOpen: boolean;
  title?: ReactNode;
  content?: ReactNode;
  size: ModalSize;
}

export interface ModalSlice {
  modal: IModalState;
  openModal: (payload: Omit<IModalState, "isOpen">) => void;
  closeModal: () => void;
}

export type BoundStore = AuthSlice & ToastSlice & ModalSlice;
export type SliceCreator<TSlice> = StateCreator<BoundStore, [], [], TSlice>;
