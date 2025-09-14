"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { use, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Checkout({ searchParams }) {
  const { id: bookingId } = use(searchParams);
  const [errors, setErrors] = useState();

  async function fetchClientSecret() {
    try {
      const res = await fetch(`/api/v1/bookings/checkout?id=${bookingId}`, {
        method: "GET",
      });

      if (!res.ok) {
        const { message: errorMessage } = await res.json();
        throw new Error(errorMessage);
      }

      const { client_secret } = await res.json();
      return client_secret;
    } catch (error) {
      setErrors(error.message);
      throw error;
    }
  }
  return (
    <div className="p-4 bg-white h-full">
      {errors ? (
        <div className="flex justify-center">
          <Link
            href="/bookings"
            className="group text-primary-500  bg-primary-50/50 hover:bg-primary-50 p-3 rounded-xl text-center transition-all duration-300"
          >
            <p className="flex gap-3 items-center font-bold tracking-wide ">
              {errors}
            </p>
            <p className="group-hover:tracking-wide duration-200">
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
