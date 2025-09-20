import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const treatments = await prisma.treatments.findMany();
    if (!treatments) {
      return NextResponse.json({ error: "Data not found!" }, { status: 404 });
    }
    return NextResponse.json({ treatments }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
