import type { ToastSlice, SliceCreator } from "@/src/store/types";

export const createToastSlice: SliceCreator<ToastSlice> = (set) => ({
  toasts: [],

  addToast: (type, message) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);

    set((state) => ({
      toasts: [...state.toasts, { id, type, message }].slice(-5),
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
});
