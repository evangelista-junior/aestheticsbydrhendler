"use client";

import { createPortal } from "react-dom";
import { useLoadingModal } from "@/store/useLoadingModal";

export default function LoadingModal() {
  const { isLoading } = useLoadingModal();

  if (isLoading) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <div className="absolute inset-0 bg-easyWhite/30 backdrop-blur-sm backdrop-saturate-100" />
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary shadow"></div>
      </div>,
      document.body
    );
  }
}
