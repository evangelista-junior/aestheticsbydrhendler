import { NextResponse } from "next/server";
import crypto from "crypto";

export function validateApiKey(givenApiKey: string) {
  const envApiKey = process.env.API_KEY;

  if (!givenApiKey || !envApiKey) {
    return NextResponse.json(
      { ok: false, message: "Access denied!" },
      { status: 401 }
    );
  }
  if (givenApiKey.length !== envApiKey.length) {
    return NextResponse.json(
      { ok: false, message: "Access denied!" },
      { status: 401 }
    );
  }

  const isValidApiKey = crypto.timingSafeEqual(
    Buffer.from(givenApiKey),
    Buffer.from(envApiKey)
  );

  if (!isValidApiKey)
    return NextResponse.json(
      { ok: false, message: "Access denied!" },
      { status: 401 }
    );
}
