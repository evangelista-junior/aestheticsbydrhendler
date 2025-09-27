import { create } from "zustand";

export const useLoadingModal = create((set, get) => ({
  isLoading: false,

  setLoading: () => set({ isLoading: !get().isLoading }),
}));
