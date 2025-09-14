import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { bookingId } = await params;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function DELETE(req, { params }) {
  try {
    const { bookingId } = await params;

    const booking = await prisma.bookings.findUnique({
      where: { id: bookingId },
      include: { token: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking information not found!" },
        { status: 404 }
      );
    }

    if (booking.cancelledAt) {
      return NextResponse.json(
        { error: "Booking has already been cancelled!" },
        { status: 209 }
      );
    }

    if (!booking.token?.providerRef) {
      return NextResponse.json(
        { error: "Payment session not found!" },
        { status: 404 }
      );
    }
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

    if (paymentIntentStatus === "succeeded") {
      const refundPayment = await stripe.refunds.create({
        payment_intent: paymentIntent.id,
      });
      if (refundPayment.status !== "succeeded") {
        throw new Error("Refund failed");
      }
    } else {
      const cancelPayment = await stripe.paymentIntents.cancel(
        paymentIntent.id
      );
      if (cancelPayment.status !== "canceled") {
        throw new Error("Payment cancellation failed");
      }
    }

    await prisma.bookings.update({
      where: {
        id: bookingId,
      },
      data: {
        cancelledAt: new Date(),
      },
    });

    //TODO: Send cancelation email

    return NextResponse.json(
      {
        success:
          "Your booking has been canceled. The cancellation will soon be reflected on your bank statement.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
