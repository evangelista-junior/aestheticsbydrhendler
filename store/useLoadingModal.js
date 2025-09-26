import { create } from "zustand";

export const useLoading = create((set, get) => ({
  isLoading: false,

  setLoading: (value) => set({ isLoading: value }),
  showLoading: () => {
    console.log(get().isLoading + " vai se fudeee");
  },
}));
