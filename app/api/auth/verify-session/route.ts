import { verifySession } from "@/app/actions/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await verifySession();

  return NextResponse.json(result);
}
