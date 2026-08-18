import { create } from "zustand";
import { createAuthSlice } from "@/src/store/slices/auth-slice";
import { createToastSlice } from "@/src/store/slices/toast-slice";
import { createModalSlice } from "@/src/store/slices/modal-slice";
import { createSidebarSlice } from "@/src/store/slices/sidebar-slice";
import { createThemeSlice } from "@/src/store/slices/theme-slice";
import type { BoundStore } from "@/src/store/types";

export const useBoundStore = create<BoundStore>()((...args) => ({
  ...createAuthSlice(...args),
  ...createToastSlice(...args),
  ...createModalSlice(...args),
  ...createSidebarSlice(...args),
  ...createThemeSlice(...args),
}));
