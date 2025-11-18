"use client";

import { apiRequest } from "@/lib/server/useApi";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { useLoadingModal } from "@/store/useLoadingModal";

export default function Success({ searchParams }) {
  const { session_id: sessionId } = use(searchParams);
  const router = useRouter();
  const { setLoading } = useLoadingModal();

  useEffect(() => {
    async function fecthCheckoutInfo() {
      try {
        setLoading(true);
        const res = await apiRequest(
          `/api/v1/bookings/checkout/success?session_id=${sessionId}`,
          {
            method: "POST",
          }
        );
        if (!res.ok) {
          throw new Error(res.message);
        }

        router.push(res.redirectUrl);
      } catch (error) {
        console.warn(error);
      } finally {
        setLoading(false);
      }
    }

    fecthCheckoutInfo();
  }, [router, sessionId, setLoading]);
  return <></>;
}
