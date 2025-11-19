import { createToken } from "@/lib/jwt";
import { sendMail } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import dateFormater from "@/lib/utils/dateFormater";
import generateUUID from "@/lib/utils/generateUUID";
import getCurrentTimeSyd from "@/lib/utils/getCurrentTimeSyd";
import { parseEmailConsultationRequest } from "@/lib/utils/parseEmailConsultationRequest";
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export async function POST(req) {
  try {
    const headerKey = await req.headers.get("x-api-key");
    if (headerKey != process.env.API_KEY)
      return NextResponse.json("Access denied!", { status: 401 });

    const data = await req.json();

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

    if (missing.length == 1 && data.consent == false) {
      return NextResponse.json(
        { ok: false, message: "Consent is required." },
        { status: 400 }
      );
    }
    if (missing.length) {
      return NextResponse.json(
        {
          ok: false,
          message: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 422 }
      );
    }
    if (data.consent !== true) {
      return NextResponse.json(
        { ok: false, message: "Consent is required." },
        { status: 400 }
      );
    }

    const parsedDate = new Date(data.preferedDate);
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth();
    const day = parsedDate.getDate();
    const formatedPreferedDate = new Date(Date.UTC(year, month, day));

    const secondsPerHour = 3600;
    const milisecondsPerSecond = 1000;
    const expiresInHours = 48;
    const issuedAt = getCurrentTimeSyd();
    const expireAt = new Date(
      issuedAt.getTime() +
        expiresInHours * secondsPerHour * milisecondsPerSecond
    );

    data.preferedDate = dateFormater(data.preferedDate);

    // TODO: Remove checker in future so it improves performance
    let jti = generateUUID();
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
        name: String(data.name).trim(),
        email: String(data.email).trim(),
        phone: String(data.phone).trim(),
        service: data.service,
        preferedDate: data.preferedDate,
        preferedTime: data.preferedTime,
        consent: data.consent,
      },
      issuedAt,
      expireAt,
    });

    const uuidToken = await prisma.tokensJWT.create({
      data: {
        token: jwt,
      },
    });

    const servicePriceInfo = await prisma.treatments.findFirst({
      where: { name: data.service },
      select: { stripeProductNumber: true },
    });

    if (!servicePriceInfo?.stripeProductNumber)
      return NextResponse.json(
        { ok: false, message: "Service not found on the database!" },
        { status: 404 }
      );

    const priceInfo = await stripe.prices.retrieve(
      servicePriceInfo.stripeProductNumber
    );

    if (!priceInfo)
      return NextResponse.json(
        { ok: false, message: "Price info not found on Stripe!" },
        { status: 404 }
      );

    await prisma.paymentTokens.create({
      data: {
        jti: jti,
        email: data.email,
        name: data.name,
        phone: data.phone,
        service: data.service,
        date: formatedPreferedDate,
        time: data.preferedTime,
        notes: !!data.notes ? data.notes : null,
        consent: Boolean(data.consent),
        amountCents: priceInfo.unit_amount,
        currency: "AUD",
        provider: "Stripe",
        providerRef: null,
        createdAt: issuedAt,
        expiresAt: expireAt,
      },
    });

    const formatedDateData = {
      ...data,
      preferedDate: dateFormater(data.preferedDate),
    };
    const emailHTML = path.join(
      process.cwd(),
      "lib/templates/consultationRequest/index.html"
    );
    const emailTXT = path.join(
      process.cwd(),
      "lib/templates/consultationRequest/index.txt"
    );
    const emailHTMLStringFormat = await fs.readFile(emailHTML, "utf8");
    const emailTXTStringFormat = await fs.readFile(emailTXT, "utf-8");
    const emailHTMLCustomized = parseEmailConsultationRequest({
      string: emailHTMLStringFormat,
      data: formatedDateData,
      checkoutUrl: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/checkout?id=${uuidToken.id}`,
    });
    const emailTXTCustomized = parseEmailConsultationRequest({
      string: emailTXTStringFormat,
      data: formatedDateData,
      checkoutUrl: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/checkout?id=${uuidToken.id}`,
    });
    await sendMail({
      emailTo: formatedDateData.email,
      emailSubject: "Finish Your Booking | Aesthetics By Dr Hendler",
      emailText: emailTXTCustomized,
      emailHtml: emailHTMLCustomized,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, message: err }, { status: 500 });
  }
}
