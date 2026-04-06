import type { ModalSlice, SliceCreator } from "@/src/store/types";

export const createModalSlice: SliceCreator<ModalSlice> = (set) => ({
  modal: {
    isOpen: false,
    title: undefined,
    content: undefined,
    size: "md",
  },

  openModal: ({ title, content, size }) => {
    set({
      modal: {
        isOpen: true,
        title,
        content,
        size,
      },
    });
  },

  closeModal: () => {
    set((state) => ({
      modal: {
        ...state.modal,
        isOpen: false,
        title: undefined,
        content: undefined,
      },
    }));
  },
});
