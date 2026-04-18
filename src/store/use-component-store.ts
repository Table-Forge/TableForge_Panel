import { create } from "zustand";
import type { IGetPaginatedParams } from "@/src/interfaces";

export type TComponentFilters = IGetPaginatedParams & object;

interface IComponentState {
  filters: TComponentFilters;
}

interface IComponentStore {
  states: Record<string, IComponentState>;
  setFilters: (key: string, filters: TComponentFilters) => void;
  resetFilters: (key: string, customDefault?: TComponentFilters) => void;
}

const DEFAULT_FILTERS: TComponentFilters = {
  page: 1,
  size: 20,
  search: "",
};

export const useComponentStore = create<IComponentStore>((set) => ({
  states: {},

  setFilters: (key, filters) =>
    set((state) => ({
      states: {
        ...state.states,
        [key]: { filters },
      },
    })),

  resetFilters: (key, customDefault) =>
    set((state) => ({
      states: {
        ...state.states,
        [key]: { filters: customDefault ?? DEFAULT_FILTERS },
      },
    })),
}));
