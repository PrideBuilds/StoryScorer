import { verifySession } from "@/app/actions/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await verifySession();

  return NextResponse.json(result);
}
