import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fieldsOnUrl = searchParams.get("fields");

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

    const treatments = await prisma.treatments.findMany({
      ...(isFiltered && { select }),
    });

    if (!treatments) {
      return NextResponse.json({ error: "Data not found!" }, { status: 404 });
    }
    return NextResponse.json({ treatments }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
