import type { ReactNode } from "react";
import type { ModalSize, ModalSlice, SliceCreator } from "@/src/store/types";

export const createModalSlice: SliceCreator<ModalSlice> = (set) => ({
  modal: {
    isOpen: false,
    title: undefined,
    content: undefined,
    size: "md",
  },

  openModal: ((arg1, arg2, arg3) => {
    const isPayloadShape =
      typeof arg1 === "object" &&
      arg1 !== null &&
      ("title" in arg1 || "content" in arg1 || "size" in arg1) &&
      arg2 === undefined &&
      arg3 === undefined;

    const payload = isPayloadShape
      ? (arg1 as {
          title?: ReactNode;
          content?: ReactNode;
          size?: ModalSize;
        })
      : {
          title: arg1 as ReactNode,
          content: arg2 as ReactNode,
          size: arg3,
        };

    const size = payload.size ?? "md";

    set({
      modal: {
        isOpen: true,
        title: payload.title,
        content: payload.content,
        size,
      },
    });
  }) as ModalSlice["openModal"],

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
