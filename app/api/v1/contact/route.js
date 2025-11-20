import { sendContactMessage } from "@/lib/mailer";
import { validateApiKey } from "@/lib/security";
import {
  emailValidator,
  fullNameValidator,
  phoneNumberValidator,
} from "@/lib/utils/regexValidators";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const headerApiKey = req.headers.get("x-api-key");

    const apiKeyValidationError = validateApiKey(headerApiKey);
    if (apiKeyValidationError) return apiKeyValidationError;

    const data = await req.json();
    const requiredData = ["name", "phone", "email", "message"];

    const missingData = requiredData.filter((k) => !data[k] | (k.trim() == ""));
    if (missingData.length) {
      return NextResponse.json(
        {
          ok: false,
          message: `Missing required fields: ${missingData.join(", ")}`,
        },
        { status: 422 }
      );
    }

    const validations = {
      name: fullNameValidator,
      phone: phoneNumberValidator,
      email: emailValidator,
    };
    const notValidData = requiredData.filter(
      (k) => validations[k]?.test(data[k]) == false
    );
    if (notValidData.length) {
      return NextResponse.json(
        {
          ok: false,
          message: `The following fields are not valid: ${notValidData.join(
            ", "
          )}`,
        },
        { status: 422 }
      );
    }

    // TODO:remove and add trycatch
    await sendContactMessage({
      contactName: data.name,
      contactEmail: data.email,
      contactPhone: data.phone,
      contactMessage: data.message,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Something went wrong on the server!" },
      { status: 500 }
    );
  }
}
