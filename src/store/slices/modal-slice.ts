import type { ReactNode } from "react";
import type {
  IModalInstance,
  ModalSize,
  ModalSlice,
  SliceCreator,
} from "@/src/store/types";

export const createModalSlice: SliceCreator<ModalSlice> = (set) => ({
  modal: {
    isOpen: false,
    title: undefined,
    content: undefined,
    size: "md",
  },
  modals: [],

  openModal: ((arg1, arg2, arg3, arg4) => {
    const isPayloadShape =
      typeof arg1 === "object" &&
      arg1 !== null &&
      ("title" in arg1 || "content" in arg1 || "size" in arg1 || "footer" in arg1) &&
      arg2 === undefined &&
      arg3 === undefined;

    const payload = isPayloadShape
      ? (arg1 as {
          title?: ReactNode;
          content?: ReactNode;
          footer?: ReactNode;
          size?: ModalSize;
        })
      : {
          title: arg1 as ReactNode,
          content: arg2 as ReactNode,
          size: arg3,
          footer: arg4 as ReactNode,
        };

    const size = payload.size ?? "md";

    set((state) => {
      const modal: IModalInstance = {
        id: Math.random().toString(36).substring(7),
        isOpen: true,
        title: payload.title,
        content: payload.content,
        footer: payload.footer,
        size,
      };

      return {
        modals: [...state.modals, modal],
        modal,
      };
    });
  }) as ModalSlice["openModal"],

  closeModal: () => {
    set((state) => {
      const modals = state.modals.slice(0, -1);
      const lastModal = modals[modals.length - 1];

      return {
        modals,
        modal: lastModal ?? {
          isOpen: false,
          title: undefined,
          content: undefined,
          size: "md",
        },
      };
    });
  },
});
