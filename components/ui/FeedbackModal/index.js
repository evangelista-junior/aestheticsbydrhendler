import { Check, XCircle } from "lucide-react";
import { createPortal } from "react-dom";
import Button from "../Button";
import Link from "next/link";

export default function FeedbackModal({
  successTitle,
  successMessage,
  errorMessage,
  onClick,
  buttonText = "Go to Homepage",
}) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm backdrop-saturate-100" />

      {!errorMessage ? (
        <div className="relative z-10 max-w-md w-full mx-4 border border-white/40 bg-transparent backdrop-blur-2xl text-white p-6 shadow-xl text-center fade-in">
          <div className="flex w-full items-center justify-center gap-1">
            <Check size={30} className="" />
            <h2 className="text-2xl font-light tracking-wider">
              {successTitle}
            </h2>
          </div>
          <p className="mt-2 text-gray-200 tracking-wide">{successMessage}</p>

          <Button
            buttonType="primaryRounded"
            className="inline-flex mt-3"
            onClick={onClick}
          >
            {buttonText}
          </Button>
        </div>
      ) : (
        <div className="relative z-10 max-w-md w-full mx-4 rounded-md border border-red-500/30 bg-easyWhite p-6 shadow-xl text-center fade-in">
          <XCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
          <h2 className="text-2xl font-semibold text-red-400 tracking-widest">
            Oops! Something went wrong
          </h2>
          <p className="mt-2 text-gray-500 tracking-wider">{errorMessage}</p>

          <div className="flex gap-3 justify-center mt-6" onClick={onClick}>
            <Button buttonType="primary">{buttonText}</Button>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
