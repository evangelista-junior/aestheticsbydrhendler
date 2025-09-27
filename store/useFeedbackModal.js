import { redirect } from "next/navigation";
import { create } from "zustand";

export const useFeedbackModal = create((set, get) => ({
  isOpen: false,
  successTitle: "Thank you",
  successMessage: "",
  errorMessage: "",
  buttonText: "Go to Homepage",
  onClick: () => redirect("/"),

  setOpen: () =>
    set({
      isOpen: !get().isOpen,
    }),
  setSuccessTitle: (value) => set({ successTitle: value }),
  setSuccessMessage: (value) => set({ successMessage: value }),
  setErrorMessage: (value) => set({ errorMessage: value }),
  setButtonText: (value) => set({ buttonText: value }),
  setOnClick: (func) => set({ onClick: func }),
}));
