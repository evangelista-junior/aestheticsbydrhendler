"use client";

import { createPortal } from "react-dom";
import Button from "../Button";
import { useFeedbackModal } from "@/store/useFeedbackModal";

export default function FeedbackModal() {
  const {
    isOpen,
    successTitle,
    successMessage,
    errorMessage,
    buttonText,
    onClick,
  } = useFeedbackModal();

  if (isOpen) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm backdrop-saturate-100" />

        {!errorMessage ? (
          <div className="relative z-10 max-w-md w-full mx-4 border border-white/30 bg-transparent backdrop-blur-2xl text-white p-6 shadow-xl text-center fade-in">
            <div className="flex w-full items-center justify-center font-light">
              <h2 className="text-2xl font-title uppercase">{successTitle}</h2>
            </div>
            <p className="mt-3 text-gray-200 uppercase text-xs tracking-wider">
              {successMessage}
            </p>

            <Button
              buttonType="confirm"
              className="inline-flex mt-3"
              onClick={onClick}
            >
              {buttonText}
            </Button>
          </div>
        ) : (
          <div className="relative z-[9999] w-full max-w-md border border-red-600/20 bg-white/20 backdrop-blur-sm backdrop-saturate-100 p-3 shadow-xl text-center fade-in">
            <p className="mt-3 text-gray-200 uppercase text-xs tracking-wider">
              {errorMessage}
            </p>
            <p className="text-white tracking-wide">
              We could not process your request at the moment. Please try again
              later or contact our team for support.
            </p>

            <div className="flex gap-3 justify-center mt-6" onClick={onClick}>
              <Button buttonType="decline">{buttonText}</Button>
            </div>
          </div>
        )}
      </div>,
      document.body
    );
  }
}
