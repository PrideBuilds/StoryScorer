import { NextResponse } from "next/server";
import { checkUsageLimit } from "@/lib/utils/checkUsageLimit";

export async function GET() {
  try {
    const result = await checkUsageLimit();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking usage limit:", error);
    return NextResponse.json(
      {
        allowed: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

