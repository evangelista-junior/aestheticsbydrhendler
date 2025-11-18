"use client";

import Button from "@/components/Button";
import { apiRequest } from "@/lib/server/useApi";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { use, useState, useCallback } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Checkout({ searchParams }) {
  const { id: bookingId } = use(searchParams);
  const [errors, setErrors] = useState();

  const fetchClientSecret = useCallback(async () => {
    try {
      const res = await apiRequest(
        `/api/v1/bookings/checkout?id=${bookingId}`,
        {}
      );
      if (!res.ok) throw new Error(res.message);

      const { client_secret } = res;
      return client_secret;
    } catch (error) {
      setErrors(error.message);
      throw error;
    }
  }, [bookingId]);

  return (
    <div className="p-4 bg-white w-full">
      {errors ? (
        <div className="flex justify-center">
          <div className="flex flex-col justify-center items-center p-3 py-6 xl:max-w-1/3 border-1 border-red-500/20 shadow-xl rounded">
            <p className="font-extralight text-2xl mb-3">{errors}</p>
            <p className="">
              We are sorry for being unable to complete your purchase.
            </p>
            <p className="mb-6">
              Click here if you want to{" "}
              <Link href="/bookings">
                <span className="underline tracking-wider hover:text-primary duration-300">
                  create a new booking!
                </span>
              </Link>
            </p>

            <Link href="/">
              <Button>Go to Homepage</Button>
            </Link>
          </div>
        </div>
      ) : (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ fetchClientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}
