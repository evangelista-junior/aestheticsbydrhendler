import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import { parseEmailConsultationRequest } from "@/utils/parseEmailConsultationRequest";
import { sendMail } from "@/lib/mailer";

export async function GET(request, { params }) {
  try {
    const { bookingId } = await params;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const booking = await prisma.bookings.findUnique({
      where: { id: bookingId },
      include: {
        token: true,
      },
    });

    return NextResponse.json(
      {
        status: booking.status,
        amount: booking.token.amountCents,
        name: booking.name,
        providerRef: booking.token.id,
      },
      { status: 200 }
    );
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

    const emailHTML = path.join(
      process.cwd(),
      "lib/templates/bookingCancellation/index.html"
    );
    const emailTXT = path.join(
      process.cwd(),
      "lib/templates/bookingCancellation/index.txt"
    );
    const emailHTMLStringFormat = await fs.readFile(emailHTML, "utf-8");
    const emailTXTStringFormat = await fs.readFile(emailTXT, "utf-8");
    const emailHTMLCustomized = parseEmailConsultationRequest({
      string: emailHTMLStringFormat,
      data: booking,
    });
    const emailTXTCustomized = parseEmailConsultationRequest({
      string: emailTXTStringFormat,
      data: booking,
    });
    const email = await sendMail({
      emailTo: booking.email,
      emailSubject: "Aesthetics by Dr Hendler | Booking Cancelled",
      emailText: emailTXTCustomized,
      emailHtml: emailHTMLCustomized,
    });

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
