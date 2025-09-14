import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { bookingId } = await params;

  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
    include: { token: true },
  });
  const sessionId = booking.token.providerRef;

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const paymentIntent = await stripe.paymentIntents.retrieve(
    session.payment_intent
  );
  if (!paymentIntent) {
    return NextResponse.json(
      { error: "Payment intent not found!" },
      { status: 404 }
    );
  }

  const paymentIntentStatus = paymentIntent.status;
  if (paymentIntentStatus == "succeeded") {
    const refundPayment = await stripe.refunds.create({
      payment_intent: paymentIntent.id,
    });
  } else {
    const cancelPayment = await stripe.paymentIntents.cancel(paymentIntent.id);
  }

  await prisma.bookings.update({
    where: {
      id: bookingId,
    },
    data: {
      cancelledAt: new Date(),
    },
  });

  return NextResponse.json(
    {
      success:
        "Your booking has been canceled. The cancellation will soon be reflected on your bank statement.",
    },
    { status: 200 }
  );
}
