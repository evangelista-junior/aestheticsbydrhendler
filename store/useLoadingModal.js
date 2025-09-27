import { create } from "zustand";

export const useLoadingModal = create((set, get) => ({
  isLoading: false,

  setLoading: (value) => set({ isLoading: value }),
}));
