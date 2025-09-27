"use client";

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
      const res = await fetch(`/api/v1/bookings/checkout?id=${bookingId}`, {
        method: "GET",
      });
      const data = await res.json();

      if (!res.ok) {
        const { error: errorMessage } = data;
        throw new Error(errorMessage);
      }

      const { client_secret } = data;
      return client_secret;
    } catch (error) {
      setErrors(error.message);
      throw error;
    }
  }, [bookingId]);

  return (
    <div className="p-4 bg-white h-full">
      {errors ? (
        <div className="flex justify-center">
          <Link
            href="/bookings"
            className="text-center group text-primary-500  bg-primary-50/50 hover:bg-primary-50 p-3 rounded-xl transition-all duration-300"
          >
            <p className="font-bold tracking-wide">{errors}</p>
            <p className="group-hover:tracking-wide duration-300">
              👉🏻 Click here to start a new booking!
            </p>
          </Link>
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
