import { sendContactMessage } from "@/lib/mailer";
import {
  emailValidator,
  fullNameValidator,
  phoneNumberValidator,
} from "@/lib/utils/regexValidators";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const headerKey = await req.headers.get("x-api-key");
    if (!headerKey) return NextResponse.json("Access denied!", { status: 401 });

    if (headerKey != process.env.API_KEY)
      return NextResponse.json("Access denied!", { status: 401 });

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
    const email = await sendContactMessage({
      contactName: data.name,
      contactEmail: data.email,
      contactPhone: data.phone,
      contactMessage: data.message,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Something went wrong on the server!" },
      { status: 500 }
    );
  }
}
