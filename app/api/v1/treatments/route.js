import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/security";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const headerApiKey = req.headers.get("x-api-key");

    const apiKeyValidationError = validateApiKey(headerApiKey);
    if (apiKeyValidationError) return apiKeyValidationError;

    const { searchParams } = new URL(req.url);
    const fieldsOnUrl = searchParams.get("fields");
    const status = searchParams.get("status");

    const fields = fieldsOnUrl?.split(`,`).filter((s) => s.trim());
    const availableFields = Object.keys(prisma.treatments.fields).reduce(
      (acc, af) => {
        acc[af] = true;
        return acc;
      },
      {}
    );
    const select = fields?.reduce((acc, f) => {
      if (availableFields[f]) {
        acc[f] = true;
      }
      return acc;
    }, {});
    const isFiltered = select && Object.keys(select).length > 0;
    const onlyAvailable = status == "AVAILABLE";

    const treatments = await prisma.treatments.findMany({
      ...(isFiltered && { select }),
      ...(onlyAvailable && { where: { availability: "AVAILABLE" } }),
    });

    if (!treatments) {
      return NextResponse.json({ error: "Data not found!" }, { status: 404 });
    }

    return NextResponse.json({ treatments, ok: true }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
