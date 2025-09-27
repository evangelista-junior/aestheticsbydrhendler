import { redirect } from "next/navigation";
import { create } from "zustand";

export const useFeedbackModal = create((set, get) => ({
  isOpen: false,
  successTitle: "Thank you",
  successMessage: "",
  errorMessage: "",
  buttonText: "Go to Homepage",
  onClick: () => redirect("/"),
  redirectToHomempage: () => {
    set({ isOpen: false }), redirect("/");
  },

  setOpenModal: () =>
    set({
      isOpen: true,
    }),
  setClearErrors: () =>
    set({
      errorMessage: "",
    }),
  setCloseModal: () => set({ isOpen: false }),
  setSuccessTitle: (value) => set({ successTitle: value }),
  setSuccessMessage: (value) => set({ successMessage: value }),
  setErrorMessage: (value) => set({ errorMessage: value }),
  setButtonText: (value) => set({ buttonText: value }),
  setOnClick: (func) => set({ onClick: func }),
}));
