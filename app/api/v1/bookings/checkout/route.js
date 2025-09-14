"use server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { decodeToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { isValidUUID } from "@/lib/utils/isValidUUID";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("id");

  if (!isValidUUID(bookingId)) {
    return NextResponse.json(
      {
        ok: false,
        error: `UUID is not valid`,
      },
      { status: 400 }
    );
  }

  const paymentToken = await prisma.tokensJWT.findUnique({
    where: {
      id: bookingId,
    },
  });
  const { valid, payload } = await decodeToken(paymentToken.token);
  if (!paymentToken) {
    return NextResponse.json(
      { ok: false, error: "Booking not found" },
      { status: 404 }
    );
  }

  if (!valid) {
    //TODO: Add webhook to run and change status of expired JWT tokens (check AWS Lambda)
    return NextResponse.json(
      {
        ok: false,
        error: `This payment link has expired for security reasons. Please start a new booking process.`,
      },
      { status: 400 }
    );
  }

  const paymentTokenInfo = await prisma.paymentTokens.findUnique({
    where: {
      jti: payload.jti,
    },
    select: {
      email: true,
      service: true,
      providerRef: true,
      status: true,
      usedAt: true,
    },
  });

  if (!paymentTokenInfo) {
    return NextResponse.json(
      { ok: false, error: "Patient not found" },
      { status: 404 }
    );
  }

  if (paymentTokenInfo.usedAt) {
    return NextResponse.json(
      {
        error: "Payment already complete!",
      },
      { status: 409 }
    );
  }

  if (paymentTokenInfo.providerRef) {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        paymentTokenInfo.providerRef
      );

      if (paymentTokenInfo.status != "expired") {
        return NextResponse.json(
          { client_secret: session.client_secret },
          { status: 200 }
        );
      }
    } catch (error) {
      console.warn("Session not found", error);
    }
  }

  const treatment = await prisma.treatments.findFirst({
    where: { name: paymentTokenInfo.service },
    select: { stripeProductNumber: true },
  });

  if (!treatment?.stripeProductNumber) {
    return NextResponse.json(
      { ok: false, error: "Treatment not found or not configured" },
      { status: 400 }
    );
  }

  const stripeProduct = treatment.stripeProductNumber;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      customer_email: paymentTokenInfo.email,
      submit_type: "pay",

      line_items: [
        {
          price: stripeProduct,
          quantity: 1,
        },
      ],
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    await prisma.paymentTokens.update({
      where: {
        jti: payload.jti,
      },
      data: {
        providerRef: session.id,
      },
    });

    return NextResponse.json(
      {
        client_secret: session.client_secret,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message ?? "Stripe error" },
      { status: 400 }
    );
  }
}
