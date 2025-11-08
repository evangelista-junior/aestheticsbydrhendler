import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import { parseEmailConsultationRequest } from "@/lib/utils/parseEmailConsultationRequest";
import { sendMail } from "@/lib/mailer";
import { checkIsRefundable } from "@/lib/business/booking/cancellation";
import dateFormater from "@/lib/utils/dateFormater";

export async function GET(req, { params }) {
  try {
    const headerKey = await req.headers.get("x-api-key");
    if (headerKey != process.env.API_KEY)
      return NextResponse.json("Access denied!", { status: 401 });

    const { bookingId } = await params;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    var booking = await prisma.bookings.findUnique({
      where: { id: bookingId },
      include: {
        token: true,
      },
    });
    const formatedDateBooking = {
      ...booking,
      date: dateFormater(booking.date),
    };

    return NextResponse.json(
      {
        status: formatedDateBooking.status,
        amount: formatedDateBooking.token.amountCents,
        name: formatedDateBooking.name,
        providerRef: formatedDateBooking.token.id,
        date: formatedDateBooking.date,
        time: formatedDateBooking.time,
        service: formatedDateBooking.service,
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
    const headerKey = await req.headers.get("x-api-key");
    if (headerKey != process.env.API_KEY)
      return NextResponse.json("Access denied!", { status: 401 });

    const { bookingId } = await params;

    var booking = await prisma.bookings.findUnique({
      where: { id: bookingId },
      include: { token: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking information not found!" },
        { status: 404 }
      );
    }

    if (booking.status == "CANCELLED") {
      return NextResponse.json(
        { error: "Booking has already been cancelled!" },
        { status: 209 }
      );
    }

    const isRefundable = checkIsRefundable({
      bookingDate: booking.date,
      bookingTime: booking.time,
    });
    if (isRefundable) {
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
      const itemRefund = await stripe.refunds.list({
        payment_intent: paymentIntent.id,
        limit: 1,
      });
      if (!itemRefund) {
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
      }
    }

    booking = await prisma.bookings.update({
      where: {
        id: bookingId,
      },
      data: {
        cancelledAt: dateFormater(new Date()),
        status: "CANCELLED",
      },
    });

    const formatedDateBooking = {
      ...booking,
      date: dateFormater(booking.date),
    };
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
      data: formatedDateBooking,
    });
    const emailTXTCustomized = parseEmailConsultationRequest({
      string: emailTXTStringFormat,
      data: formatedDateBooking,
    });
    const email = await sendMail({
      emailTo: formatedDateBooking.email,
      emailSubject: "Booking Cancelled | Aesthetics By Dr Hendler",
      emailText: emailTXTCustomized,
      emailHtml: emailHTMLCustomized,
    });

    return NextResponse.json(
      {
        status: booking.status,
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
