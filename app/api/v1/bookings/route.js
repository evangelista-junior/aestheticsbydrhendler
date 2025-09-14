import { createToken } from "@/lib/jwt";
import { sendMail, testConnection } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";
import generateUUID from "@/utils/generateUUID";
import { parseEmailConsultationRequest } from "@/utils/parseEmailConsultationRequest";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
export async function POST(request) {
  try {
    const data = await request.json();
    const secondsPerHour = 3600;
    const milisecondsPerSecond = 1000;
    const expiresInHours = 48;
    const issuedAt = new Date();
    const expireAt = new Date(
      issuedAt.getTime() +
        expiresInHours * secondsPerHour * milisecondsPerSecond
    );

    const required = [
      "name",
      "email",
      "phone",
      "service",
      "preferedDate",
      "preferedTime",
      "consent",
    ];
    const missing = required.filter(
      (k) => !data?.[k] || String(data[k]).trim() === ""
    );
    if (missing.length) {
      return Response.json(
        {
          ok: false,
          message: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }
    if (data.consent !== true) {
      return Response.json(
        { ok: false, message: "Consent is required." },
        { status: 400 }
      );
    }

    const jti = generateUUID();
    let jtiAlreadyExists = !!(await prisma.paymentTokens.findUnique({
      where: { jti: jti },
    }));
    while (jtiAlreadyExists) {
      jti = generateUUID();
      jtiAlreadyExists = !!(await prisma.paymentTokens.findUnique({
        where: { jti: jti },
      }));
    }

    const jwt = await createToken({
      jti,
      audience: "api/bookings",
      scope: "booking-request",
      unreservedClaims: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        preferedDate: data.preferedDate,
        preferedTime: data.preferedTime,
        consent: data.consent,
      },
      issuedAt,
      expireAt,
    });

    // DB
    const uuidToken = await prisma.tokensJWT.create({
      data: {
        token: jwt,
      },
    });

    const paymentToken = await prisma.paymentTokens.create({
      data: {
        jti: jti,
        email: data.email,
        name: data.name,
        phone: data.phone,
        service: data.service,
        date: data.preferedDate,
        time: data.preferedTime,
        notes: data.notes == "" ? null : data.notes,
        consent: Boolean(data.consent),
        amountCents: 9000,
        currency: "AUD",
        provider: "Stripe",
        providerRef: null,
        createdAt: issuedAt,
        expiresAt: expireAt,
      },
    });

    // Email
    const emailHTML = path.join(
      process.cwd(),
      "lib/templates/consultationRequest/consultationRequest.html"
    );
    const emailTXT = path.join(
      process.cwd(),
      "lib/templates/consultationRequest/consultationRequest.txt"
    );
    const emailHTMLString = await fs.readFile(emailHTML, "utf8");
    const emailTXTStringConverted = await fs.readFile(emailTXT, "utf-8");
    const emailHTMLCustomized = parseEmailConsultationRequest({
      string: emailHTMLString,
      data,
      checkoutUrl: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/checkout?id=${uuidToken.id}`,
    });
    const emailTXTCustomized = parseEmailConsultationRequest({
      string: emailTXTStringConverted,
      data,
      checkoutUrl: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/checkout?id=${uuidToken.id}`,
    });
    const info = await sendMail({
      emailTo: data.email,
      emailSubject: "Aesthetics by Dr Hendler | Complete your booking",
      emailText: emailTXTCustomized,
      emailHtml: emailHTMLCustomized,
    });

    return Response.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Booking API error:", err);
    return Response.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
