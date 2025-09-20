"use client";

import { redirect, useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function Success({ searchParams }) {
  const { session_id: sessionId } = use(searchParams);
  const router = useRouter();

  useEffect(() => {
    async function fecthCheckoutInfo() {
      try {
        const res = await fetch(
          `/api/v1/bookings/checkout/success?session_id=${sessionId}`,
          {
            method: "POST",
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const apiResponse = await res.json();
        router.push(apiResponse.redirectUrl);
      } catch (error) {
        //TODO: treat this
      }
    }

    fecthCheckoutInfo();
  }, [router, sessionId]);
  return <></>;
}
