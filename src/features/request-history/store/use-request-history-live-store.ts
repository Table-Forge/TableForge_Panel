import { create } from "zustand";

export type TPauseReason = "manual" | "scroll" | "filter" | "page" | null;

interface IRequestHistoryLiveStore {
  isPaused: boolean;
  pauseReason: TPauseReason;
  pendingCount: number;
  pause: (reason: "manual" | "scroll" | "filter" | "page") => void;
  resume: () => void;
  incrementPending: () => void;
  reset: () => void;
}

export const useRequestHistoryLiveStore = create<IRequestHistoryLiveStore>(
  (set) => ({
    isPaused: false,
    pauseReason: null,
    pendingCount: 0,
    pause: (reason) =>
      set({
        isPaused: true,
        pauseReason: reason,
      }),
    resume: () =>
      set({
        isPaused: false,
        pauseReason: null,
        pendingCount: 0,
      }),
    incrementPending: () =>
      set((state) => ({
        pendingCount: state.pendingCount + 1,
      })),
    reset: () =>
      set({
        isPaused: false,
        pauseReason: null,
        pendingCount: 0,
      }),
  }),
);
