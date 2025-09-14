"use server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  try {
    if (!sessionId) {
      return NextResponse.json(
        { error: "Please provide a valid session_id" },
        { status: 400 }
      );
    }

    const paymentToken = await prisma.paymentTokens.update({
      where: {
        providerRef: sessionId,
      },
      data: {
        usedAt: new Date(),
        status: "CONFIRMED",
      },
    });
    if (!paymentToken) {
      return NextResponse.json(
        { error: "Booking request not found!" },
        { status: 404 }
      );
    }

    const booking = await prisma.bookings.findUnique({
      where: { tokenId: paymentToken.id },
    });

    if (!booking) {
      booking = await prisma.bookings.create({
        data: {
          email: paymentToken.email,
          name: paymentToken.name,
          phone: paymentToken.phone,
          service: paymentToken.service,
          date: paymentToken.date,
          time: paymentToken.time,
          notes: paymentToken.notes,
          consent: paymentToken.consent,
          confirmedAt: new Date(),
          tokenId: paymentToken.id,
        },
      });
    }

    return NextResponse.json(
      {
        paymentStatus: paymentToken.status,
        paymentAmount: paymentToken.amountCents,
        customerName: paymentToken.name,
        referenceNumber: paymentToken.id,
        bookingId: booking.id,
      },
      { status: 200 }

      //TODO:Send email to patient
    );
  } catch (err) {
    console.error("API error /bookings/return:", err);
    return NextResponse.json(
      { error: "Session invalid or inexistent" },
      { status: 404 }
    );
  }
}
