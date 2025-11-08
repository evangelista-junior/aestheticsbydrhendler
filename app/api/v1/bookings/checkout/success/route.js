"use server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "node:path";
import fs from "node:fs/promises";
import { parseEmailConsultationRequest } from "@/lib/utils/parseEmailConsultationRequest";
import { sendMail } from "@/lib/mailer";
import dateFormater from "@/lib/utils/dateFormater";

export async function POST(req) {
  try {
    const headerKey = await req.headers.get("x-api-key");
    if (headerKey != process.env.API_KEY)
      return NextResponse.json("Access denied!", { status: 401 });

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json(
        { error: "Please provide a valid session_id" },
        { status: 400 }
      );
    }

    var paymentToken = await prisma.paymentTokens.findUnique({
      where: {
        providerRef: sessionId,
      },
    });
    if (!paymentToken) {
      return NextResponse.json(
        { error: "Booking request not found!" },
        { status: 404 }
      );
    }
    if (!paymentToken.usedAt) {
      paymentToken = await prisma.paymentTokens.update({
        where: {
          providerRef: sessionId,
        },
        data: {
          usedAt: new Date(),
          status: "CONFIRMED",
        },
      });
    }

    var booking = await prisma.bookings.findUnique({
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

    const formatedDatePaymentToken = {
      ...paymentToken,
      date: dateFormater(paymentToken.date),
    };
    const emailHTML = path.join(
      process.cwd(),
      "lib/templates/bookingConfirmation/index.html"
    );
    const emailTXT = path.join(
      process.cwd(),
      "lib/templates/bookingConfirmation/index.txt"
    );
    const emailHTMLStringFormat = await fs.readFile(emailHTML, "utf-8");
    const emailTXTStringFormat = await fs.readFile(emailTXT, "utf-8");
    const emailHTMLCustomized = parseEmailConsultationRequest({
      string: emailHTMLStringFormat,
      data: formatedDatePaymentToken,
      bookingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}`,
    });
    const emailTXTCustomized = parseEmailConsultationRequest({
      string: emailTXTStringFormat,
      data: formatedDatePaymentToken,
      bookingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}`,
    });
    const email = await sendMail({
      emailTo: formatedDatePaymentToken.email,
      emailSubject: "Booking Confirmed | Aesthetics By Dr Hendler",
      emailText: emailTXTCustomized,
      emailHtml: emailHTMLCustomized,
    });

    return NextResponse.json(
      {
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("API error /bookings/return:", err);
    return NextResponse.json(
      { error: "Session invalid or inexistent" },
      { status: 404 }
    );
  }
}
